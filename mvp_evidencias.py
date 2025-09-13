# mvp_evidencias.py — Prints de evidência do MVP (dados, modelo e resumo)
# Rode com:  python mvp_evidencias.py
# Cole os prints num PPT com títulos e 1-2 bullets explicando cada etapa.

import os, sys, platform
import numpy as np
import pandas as pd

# ---- 1) Ambiente e versões
print("\n[1] Ambiente")
print("Python  :", sys.version.split()[0], "| Platform:", platform.platform())
import sklearn
print("pandas  :", pd.__version__, "| scikit-learn:", sklearn.__version__)

# ---- 2) Carga do CSV
CSV_PATH = os.getenv("CSV_PATH", "clientes_segmentados.csv")
print("\n[2] Carga do CSV")
print("Arquivo :", os.path.abspath(CSV_PATH))
df = pd.read_csv(CSV_PATH, sep=";", decimal=",")
print("Shape   :", df.shape)
print("Colunas :", list(df.columns))
print("\nAmostra (5 linhas):")
print(df.head(5).to_string(index=False))

# ---- 3) Features usadas no KMeans
features = [
    "recencia_dias",
    "frequencia",
    "valor_monetario_total",
    "media_passagens_por_compra",
    "pct_viagens_ida_volta",
]
print("\n[3] Features usadas:")
print(features)
print("\nEstatísticas das features (describe):")
print(df[features].describe().round(2).to_string())

# ---- 4) Normalização
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X = scaler.fit_transform(df[features])
print("\n[4] Normalização (StandardScaler)")
print("Means :", np.round(scaler.mean_, 2))
print("Vars  :", np.round(scaler.var_, 2))

# ---- 5) KMeans (treino) + distribuição
from sklearn.cluster import KMeans
k = 6
kmeans = KMeans(n_clusters=k, random_state=42, n_init="auto")
labels = kmeans.fit_predict(X)
print("\n[5] KMeans")
print("k        :", k)
print("inertia_ :", round(kmeans.inertia_, 2))
counts = np.bincount(labels, minlength=k)
print("Tamanho por cluster (0..k-1):", counts.tolist())

# ---- 6) Silhouette (qualidade rápida)
# Obs: custo O(n^2) em amostra grande; amostre para acelerar se necessário
from sklearn.metrics import silhouette_score
amostra = min(len(X), 50000)  # limite opcional
idx = np.random.RandomState(42).choice(len(X), size=amostra, replace=False)
sil = silhouette_score(X[idx], labels[idx])
print("\n[6] Silhouette score (amostra={}):".format(amostra), round(sil, 3))

# ---- 7) Perfil por cluster (médias/medianas)
df_model = df.copy()
df_model["segmento"] = labels  # usa os rótulos recém-treinados
print("\n[7] Perfil por cluster (médias):")
profile_mean = df_model.groupby("segmento")[features].mean().round(2)
print(profile_mean.to_string())
print("\nPerfil por cluster (medianas):")
profile_med = df_model.groupby("segmento")[features].median().round(2)
print(profile_med.to_string())

# ---- 8) Resumo para o dashboard
summary = (
    df_model.groupby("segmento")
      .agg(tamanho_grupo=("id_cliente","count"),
           ticket_medio=("valor_monetario_total","mean"),
           monetario_total=("valor_monetario_total","sum"))
      .reset_index()
)
total = summary["tamanho_grupo"].sum()
summary["pct_clientes"] = (summary["tamanho_grupo"]/total*100).round(2)
summary["ticket_medio"] = summary["ticket_medio"].round(2)
summary["monetario_total"] = summary["monetario_total"].round(2)
print("\n[8] Resumo (para dashboard):")
print(summary.to_string(index=False))

# ---- 9) Personas (rótulos amigáveis)
SEGMENT_NAMES = {
    0: "Trecho Único Recorrente",
    1: "Planejadores Ida & Volta",
    2: "Ultra-VIP / Corporativo",
    3: "Super-Frequentes Recentes",
    4: "Em Pausa Econômicos",        # (novo nome sugerido)
    5: "Regulares de Alto Valor",
}
summary["persona"] = summary["segmento"].map(SEGMENT_NAMES)
print("\n[9] Mapeamento de personas (id -> nome):")
print(summary[["segmento","persona","tamanho_grupo","pct_clientes","ticket_medio"]]
      .sort_values("segmento").to_string(index=False))

# ---- 10) Artefato salvo para BI/PPT
OUT = "cluster_summary_k6.csv"
summary.to_csv(OUT, index=False)
print("\n[10] Arquivo salvo:", os.path.abspath(OUT))
