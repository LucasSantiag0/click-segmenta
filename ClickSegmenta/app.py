from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os

# -------------------------------------------
# Configs
# -------------------------------------------
CSV_PATH = os.getenv("CSV_PATH", "clientes_segmentados.csv")   # base agregada (por cliente)
TRANS_CSV_PATH = os.getenv("TRANS_CSV_PATH", "df_t.csv")       # base transacional (linha a linha)
PORT = int(os.getenv("PORT", 5000))
TRANS_SEP = os.getenv("TRANS_SEP", ",")
TRANS_DEC = os.getenv("TRANS_DEC", ".")

# DataFrames globais
DF = None         # clientes agregados
SUMMARY = None
DF_TRANS = None   # transações (com purchase_datetime)

# -------------------------------------------
# Utils
# -------------------------------------------
def to_numeric_safe(s):
    if s.dtype == object:
        # tenta lidar com pt-BR
        s = s.str.replace(".", "", regex=False).str.replace(",", ".", regex=False)
    return pd.to_numeric(s, errors="coerce")

# -------------------------------------------
# Carga e preparação dos dados
# -------------------------------------------
def load_data() -> None:
    """Carrega base agregada (clientes)."""
    global DF, SUMMARY
    DF = pd.read_csv(CSV_PATH, sep=";", decimal=",")
    required = {"id_cliente", "segmento", "valor_monetario_total"}
    missing = required - set(DF.columns)
    if missing:
        raise ValueError(f"CSV sem as colunas obrigatórias: {sorted(missing)}")

    num_cols = ["recencia_dias","frequencia","valor_monetario_total",
                "media_passagens_por_compra","pct_viagens_ida_volta"]
    for col in num_cols:
        if col in DF.columns:
            DF[col] = pd.to_numeric(DF[col], errors="coerce")

    SUMMARY = (DF.groupby("segmento")
                 .agg(tamanho_grupo=("id_cliente","count"),
                      ticket_medio=("valor_monetario_total","mean"),
                      monetario_total=("valor_monetario_total","sum"))
                 .reset_index())
    total = SUMMARY["tamanho_grupo"].sum()
    SUMMARY["pct_clientes"] = (SUMMARY["tamanho_grupo"]/total*100).round(2)
    SUMMARY["ticket_medio"] = SUMMARY["ticket_medio"].round(2)
    SUMMARY["monetario_total"] = SUMMARY["monetario_total"].round(2)
    print("Colunas (clientes):", list(DF.columns))

def load_trans_data() -> None:
    """Carrega base transacional e garante purchase_datetime/gmv_success."""
    global DF_TRANS
    if not os.path.exists(TRANS_CSV_PATH):
        print(f"[WARN] TRANS_CSV_PATH não encontrado: {TRANS_CSV_PATH}. Endpoints temporais retornarão vazio.")
        DF_TRANS = None
        return

    DF_TRANS = pd.read_csv(TRANS_CSV_PATH, sep=TRANS_SEP, decimal=TRANS_DEC)

    # id_cliente (mapeia se vier como fk_contact)
    if "id_cliente" not in DF_TRANS.columns and "fk_contact" in DF_TRANS.columns:
        DF_TRANS["id_cliente"] = DF_TRANS["fk_contact"]

    # purchase_datetime: usa existente ou monta de date_purchase + time_purchase
    if "purchase_datetime" not in DF_TRANS.columns:
        if {"date_purchase","time_purchase"}.issubset(DF_TRANS.columns):
            date = DF_TRANS["date_purchase"].astype(str).str.strip().replace({"nan": None, "NaN": None})
            time = DF_TRANS["time_purchase"].astype(str).str.strip().replace({"nan": None, "NaN": None})
            raw = (date.fillna("1900-01-01") + " " + time.fillna("00:00:00"))
            dt = pd.to_datetime(raw, errors="coerce", format="%Y-%m-%d %H:%M:%S")
            # fallback para dd/mm/yyyy se necessário
            dt = dt.fillna(pd.to_datetime(raw, errors="coerce", dayfirst=True))
            DF_TRANS["purchase_datetime"] = dt
        else:
            print("[WARN] Sem purchase_datetime e sem date/time_purchase.")
            DF_TRANS["purchase_datetime"] = pd.NaT
    else:
        DF_TRANS["purchase_datetime"] = pd.to_datetime(DF_TRANS["purchase_datetime"], errors="coerce")

    # numéricos usados nos endpoints
    if "gmv_success" in DF_TRANS.columns:
        DF_TRANS["gmv_success"] = to_numeric_safe(DF_TRANS["gmv_success"])
    if "is_round_trip" in DF_TRANS.columns:
        DF_TRANS["is_round_trip"] = pd.to_numeric(DF_TRANS["is_round_trip"], errors="coerce").fillna(0).astype(int)

    print("Colunas (transações):", list(DF_TRANS.columns))

# -------------------------------------------
# App e CORS
# -------------------------------------------
app = Flask(__name__)
CORS(app)

load_data()
load_trans_data()

# -------------------------------------------
# Endpoints auxiliares
# -------------------------------------------
@app.get("/api/health")
def health():
    return jsonify(status="ok",
                   rows_clientes=int(len(DF)),
                   rows_transacoes=int(len(DF_TRANS)) if DF_TRANS is not None else 0), 200

@app.get("/api/schema")
def schema():
    return jsonify(
        clientes=list(DF.columns),
        transacoes=(list(DF_TRANS.columns) if DF_TRANS is not None else [])
    ), 200

# -------------------------------------------
# Endpoints principais (clientes agregados)
# -------------------------------------------
@app.get("/api/segmentos")
def get_segmentos():
    # ... (inalterado, usa DF) ...
    df = DF
    seg = request.args.get("segment", request.args.get("segmento"))
    if seg is not None:
        try:
            seg_val = int(seg); df = df[df["segmento"] == seg_val]
        except ValueError:
            pass
    sample_n = request.args.get("sample", type=int)
    if sample_n: df = df.sample(n=min(sample_n, len(df)), random_state=42)
    columns = request.args.get("columns")
    if columns:
        cols = [c.strip() for c in columns.split(",") if c.strip() in df.columns]
        if cols: df = df[cols]
    limit = request.args.get("limit", type=int)
    offset = request.args.get("offset", default=0, type=int)
    if limit is not None: df = df.iloc[offset: offset+limit]
    return jsonify(df.to_dict(orient="records")), 200

@app.get("/api/segmentos/summary")
def get_summary():
    if request.args.get("refresh") == "1":
        load_data(); load_trans_data()
    cols = ["segmento","tamanho_grupo","ticket_medio"]
    extra = request.args.get("extra")
    if extra:
        for k in (x.strip() for x in extra.split(",")):
            if k in SUMMARY.columns and k not in cols: cols.append(k)
    return jsonify(SUMMARY[cols].to_dict(orient="records")), 200

@app.get("/api/kpis")
def get_kpis():
    total_clientes = int(DF["id_cliente"].nunique())
    ticket_medio = float(DF["valor_monetario_total"].mean())
    return jsonify({
        "totalClientes": total_clientes,
        "ticketMedio": round(ticket_medio, 2),
        "taxaRetencao": 87.3,
        "previsao7dias": 1247
    }), 200

# -------------------------------------------
# Endpoints temporais (usam transações)
# -------------------------------------------
@app.get("/api/sales/trend")
def sales_trend():
    if DF_TRANS is None or "purchase_datetime" not in DF_TRANS.columns or "gmv_success" not in DF_TRANS.columns:
        return jsonify([]), 200

    df = DF_TRANS.dropna(subset=["purchase_datetime"]).copy()
    df["month"] = df["purchase_datetime"].dt.to_period("M").dt.to_timestamp()

    gmv = df.groupby("month")["gmv_success"].sum(min_count=1).reset_index(name="vendas")
    gmv["previsao"] = gmv["vendas"].rolling(window=3, min_periods=1).mean().round(2)
    gmv["meta"] = (gmv["previsao"] * 1.10).round(2)

    clientes = df.groupby("month")["id_cliente"].nunique().reset_index(name="clientes")
    out = gmv.merge(clientes, on="month", how="left")

    meses_pt = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]
    m = out["month"].dt.month
    y2 = (out["month"].dt.year % 100).astype(int)
    out["label"] = [f"{meses_pt[mi-1]}/{y:02d}" for mi, y in zip(m, y2)]
    out["year"]  = out["month"].dt.year.astype(int)
    return jsonify(out[["label","year","vendas","previsao","meta","clientes"]].to_dict(orient="records")), 200

@app.get("/api/funnel")
def funnel():
    df = DF_TRANS if DF_TRANS is not None else DF
    total_pedidos = int(df["id_cliente"].count())
    pagos = int((df.get("status_pagamento") == "pago").sum()) if "status_pagamento" in df else int(total_pedidos * 0.42)
    ida_volta = int((df.get("is_round_trip") == 1).sum()) if "is_round_trip" in df else int(total_pedidos * 0.28)
    compra = pagos
    data = [
        {"stage":"Visitantes","value":max(total_pedidos, pagos)},
        {"stage":"Interessados","value":int(total_pedidos*0.75)},
        {"stage":"Consideração","value":pagos},
        {"stage":"Intenção","value":ida_volta},
        {"stage":"Compra","value":compra},
    ]
    return jsonify(data), 200

@app.get("/api/regions")
def regions():
    df = DF_TRANS if DF_TRANS is not None else DF
    col = "place_origin" if "place_origin" in df.columns else ("place_origin_return" if "place_origin_return" in df.columns else None)
    if col is None:
        return jsonify([]), 200
    grp = (df.groupby(col)["id_cliente"].nunique()
             .reset_index(name="clientes")
             .sort_values("clientes", ascending=False).head(8))
    total = int(grp["clientes"].sum()) or 1
    grp["participacao"] = (grp["clientes"] / total * 100).round(1)
    grp.rename(columns={col:"regiao"}, inplace=True)
    return jsonify(grp.to_dict(orient="records")), 200

@app.get("/api/hourly")
def hourly():
    if DF_TRANS is None or "purchase_datetime" not in DF_TRANS.columns:
        return jsonify([]), 200
    hrs = (DF_TRANS.dropna(subset=["purchase_datetime"])["purchase_datetime"]
             .dt.hour.value_counts().sort_index().reset_index())
    hrs.columns = ["hour","qtd"]
    hrs["media"] = hrs["qtd"].rolling(window=3, min_periods=1).mean().round(1)
    hrs["label"] = hrs["hour"].apply(lambda h: f"{h:02d}h")
    return jsonify(hrs[["label","qtd","media"]].to_dict(orient="records")), 200

# -------------------------------------------
# Boot
# -------------------------------------------
if __name__ == "__main__":
    app.run(debug=True, port=PORT)
