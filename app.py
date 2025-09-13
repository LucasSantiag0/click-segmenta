# ==============================================================================
# API de Segmentação - Flask
# Objetivo: servir dados de clientes segmentados para o front (Next.js)
# Destaques:
#  - Leitura única do CSV (configurável via env)
#  - Validação e normalização de tipos numéricos
#  - Summary pré-computado (com opção de refresh)
#  - Filtros e paginação em /api/segmentos (segment, limit, offset, columns, sample)
#  - Endpoints auxiliares: /api/health e /api/schema
#  - Compatibilidade com chaves esperadas no front (tamanho_grupo, ticket_medio)
# ==============================================================================

from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os

# -------------------------------------------
# Configurações
# -------------------------------------------
CSV_PATH = os.getenv("CSV_PATH", "clientes_segmentados.csv")  # caminho do CSV (pode vir de variável de ambiente)
PORT = int(os.getenv("PORT", 5000))

# DataFrames globais (cache simples em memória)
DF = None       # base completa (linhas de clientes)
SUMMARY = None  # resumo por segmento


# -------------------------------------------
# Carga e preparação dos dados
# -------------------------------------------
def load_data() -> None:
    """Carrega o CSV, valida colunas mínimas, força tipos numéricos e calcula o SUMMARY."""
    global DF, SUMMARY

    # Leitura do CSV (separador ';' e decimal ',')
    DF = pd.read_csv(CSV_PATH, sep=";", decimal=",")

    # Validação mínima: estas colunas são usadas em endpoints
    required = {"id_cliente", "segmento", "valor_monetario_total"}
    missing = required - set(DF.columns)
    if missing:
        raise ValueError(f"CSV sem as colunas obrigatórias: {sorted(missing)}")

    # Força numéricos nas métricas mais comuns do teu pipeline (se existirem)
    num_cols = [
        "recencia_dias",
        "frequencia",
        "valor_monetario_total",
        "media_passagens_por_compra",
        "pct_viagens_ida_volta",
    ]
    for col in num_cols:
        if col in DF.columns:
            DF[col] = pd.to_numeric(DF[col], errors="coerce")

    # Pré-computa resumo por segmento (mantendo as chaves esperadas no front)
    SUMMARY = (
        DF.groupby("segmento")
          .agg(
              tamanho_grupo=("id_cliente", "count"),
              ticket_medio=("valor_monetario_total", "mean"),
              monetario_total=("valor_monetario_total", "sum"),
          )
          .reset_index()
    )

    # Métricas auxiliares úteis na apresentação
    total = SUMMARY["tamanho_grupo"].sum()
    SUMMARY["pct_clientes"] = (SUMMARY["tamanho_grupo"] / total * 100).round(2)
    SUMMARY["ticket_medio"] = SUMMARY["ticket_medio"].round(2)
    SUMMARY["monetario_total"] = SUMMARY["monetario_total"].round(2)

    print("Colunas carregadas:", list(DF.columns))  # log útil para validar no console


# -------------------------------------------
# App e CORS
# -------------------------------------------
app = Flask(__name__)
CORS(app)  # permite que o Next.js consuma sem dor de CORS

# Carrega os dados na inicialização
load_data()


# -------------------------------------------
# Endpoints auxiliares (apresentação/monitoramento)
# -------------------------------------------
@app.get("/api/health")
def health():
    """Saúde da API (para monitoramento)."""
    return jsonify(status="ok", rows=int(len(DF))), 200


@app.get("/api/schema")
def schema():
    """Esquema simples: lista as colunas disponíveis no CSV."""
    return jsonify(columns=list(DF.columns)), 200


# -------------------------------------------
# Endpoints principais
# -------------------------------------------
@app.get("/api/segmentos")
def get_segmentos():
    """
    Retorna linhas da base de clientes.
    Query params:
      - segment / segmento: filtra por id do cluster (int)
      - limit: limita o nº de linhas (int)
      - offset: deslocamento para paginação (int)
      - columns: lista de colunas separadas por vírgula (ex: id_cliente,segmento,frequencia)
      - sample: amostra aleatória de N linhas (int) — útil para testes rápidos
    Observação: sem limit, retorna tudo (compatível com o front atual que faz streaming via Next).
    """
    df = DF

    # Filtro por segmento (aceita "segment" OU "segmento")
    seg = request.args.get("segment", request.args.get("segmento"))
    if seg is not None:
        try:
            seg_val = int(seg)
            df = df[df["segmento"] == seg_val]
        except ValueError:
            pass  # se não for inteiro, ignora o filtro

    # Amostra aleatória (útil p/ não puxar 500k linhas em testes manuais)
    sample_n = request.args.get("sample", type=int)
    if sample_n:
        df = df.sample(n=min(sample_n, len(df)), random_state=42)

    # Seleção de colunas (reduz payload)
    columns = request.args.get("columns")
    if columns:
        cols = [c.strip() for c in columns.split(",") if c.strip() in df.columns]
        if cols:
            df = df[cols]

    # Paginação simples
    limit = request.args.get("limit", type=int)
    offset = request.args.get("offset", default=0, type=int)
    if limit is not None:
        df = df.iloc[offset: offset + limit]

    return jsonify(df.to_dict(orient="records")), 200


@app.get("/api/segmentos/summary")
def get_summary():
    """
    Retorna o resumo por segmento.
    Compatível com o front: chaves 'segmento', 'tamanho_grupo', 'ticket_medio'.
    Query params:
      - refresh=1  → recarrega o CSV e recomputa o summary
      - extra=pct_clientes,monetario_total → inclui colunas extras no retorno
    """
    # Permite forçar recálculo (útil quando você trocar o CSV em produção)
    if request.args.get("refresh") == "1":
        load_data()

    # Campos básicos que o dashboard já usa
    cols = ["segmento", "tamanho_grupo", "ticket_medio"]

    # Campos extras opcionais
    extra = request.args.get("extra")
    if extra:
        for key in extra.split(","):
            k = key.strip()
            if k in SUMMARY.columns and k not in cols:
                cols.append(k)

    return jsonify(SUMMARY[cols].to_dict(orient="records")), 200


@app.get("/api/kpis")
def get_kpis():
    """
    KPIs de topo do dashboard.
    Nota: taxa_retencao e previsao_7_dias são placeholders enquanto não houver série temporal histórica.
    """
    total_clientes = int(DF["id_cliente"].nunique())
    ticket_medio = float(DF["valor_monetario_total"].mean())

    # Placeholders (trocar quando houver dados de recorrência/coortes/sazonalidade)
    taxa_retencao = 87.3
    previsao_7_dias = 1247

    return jsonify({
        "totalClientes": total_clientes,
        "ticketMedio": round(ticket_medio, 2),
        "taxaRetencao": taxa_retencao,
        "previsao7dias": previsao_7_dias
    }), 200

# --- Tendência de Vendas vs Meta ---
@app.get("/api/sales/trend")
def sales_trend():
    df = DF.copy()
    df["month"] = pd.to_datetime(df["purchase_datetime"]).dt.to_period("M").dt.to_timestamp()
    gmv = df.groupby("month")["gmv_success"].sum().reset_index(name="vendas")

    # previsão simples: média móvel de 3 meses (ajuste se quiser)
    gmv["previsao"] = gmv["vendas"].rolling(window=3, min_periods=1).mean().round(2)
    # meta: +10% sobre a média móvel (exemplo)
    gmv["meta"] = (gmv["previsao"] * 1.10).round(2)

    # clientes (opcional): distintos por mês
    clientes = df.groupby("month")["id_cliente"].nunique().reset_index(name="clientes")
    out = gmv.merge(clientes, on="month", how="left")
    out["month"] = out["month"].dt.strftime("%b")  # Jan, Fev, ...
    return jsonify(out.to_dict(orient="records")), 200

# --- Funil de Conversão (proxy) ---
@app.get("/api/funnel")
def funnel():
    df = DF.copy()
    total_pedidos = int(df["id_cliente"].count())
    pagos = int((df.get("status_pagamento") == "pago").sum()) if "status_pagamento" in df else int(total_pedidos * 0.42)
    ida_volta = int((df.get("is_round_trip") == 1).sum()) if "is_round_trip" in df else int(total_pedidos * 0.28)
    compra = pagos  # último estágio (ajuste conforme seu status real)

    data = [
        {"stage": "Visitantes",   "value": max(total_pedidos, pagos)},  # proxy
        {"stage": "Interessados", "value": int(total_pedidos * 0.75)},
        {"stage": "Consideração", "value": pagos},
        {"stage": "Intenção",     "value": ida_volta},
        {"stage": "Compra",       "value": compra},
    ]
    return jsonify(data), 200

# --- Distribuição Regional (por origem) ---
@app.get("/api/regions")
def regions():
    df = DF.copy()
    col = "place_origin" if "place_origin" in df.columns else "place_origin_return"
    grp = (df.groupby(col)["id_cliente"]
             .nunique()
             .reset_index(name="clientes")
             .sort_values("clientes", ascending=False)
             .head(8))
    total = int(grp["clientes"].sum())
    grp["participacao"] = (grp["clientes"] / total * 100).round(1)
    grp.rename(columns={col: "regiao"}, inplace=True)
    return jsonify(grp.to_dict(orient="records")), 200

# --- Radar de Performance ---
@app.get("/api/performance")
def performance():
    df = DF.copy()
    # proxies simples (ajuste se tiver métricas reais)
    conv = 100 * (df["gmv_success"] > 0).mean()
    freq = float(df["frequencia"].mean()) if "frequencia" in df else 1.0
    ticket = float(df["valor_monetario_total"].mean())
    retencao = 87.3  # já usado como placeholder
    satisfacao = 76.0  # proxy estático

    data = [
        {"metric": "Conversão", "value": round(conv, 1)},
        {"metric": "Frequência", "value": round(freq * 10, 1)},  # normaliza p/ escalar no radar
        {"metric": "Ticket Médio", "value": round(ticket / max(ticket,1) * 100, 1)},
        {"metric": "Retenção", "value": retencao},
        {"metric": "Satisfação", "value": satisfacao},
    ]
    return jsonify(data), 200

# --- Padrão por horário ---
@app.get("/api/hourly")
def hourly():
    df = DF.copy()
    hrs = (pd.to_datetime(df["purchase_datetime"])
             .dt.hour.value_counts()
             .sort_index()
             .reset_index())
    hrs.columns = ["hour","qtd"]
    # média móvel simples como "linha"
    hrs["media"] = hrs["qtd"].rolling(window=3, min_periods=1).mean().round(1)
    # formata hora
    hrs["label"] = hrs["hour"].apply(lambda h: f"{h:02d}h")
    return jsonify(hrs[["label","qtd","media"]].to_dict(orient="records")), 200


# -------------------------------------------
# Boot
# -------------------------------------------
if __name__ == "__main__":
    # debug=True facilita hot-reload em dev; PORT pode ser alterada por env
    app.run(debug=True, port=PORT)