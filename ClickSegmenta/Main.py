import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib

# ==============================================================================
#                    CARREGAMENTO E LIMPEZA DOS DADOS
# ==============================================================================

# Carrega o dataset real da ClickBus
df = pd.read_csv('df_t.csv')

# --- Tratamento de Dados ---

# Garante a existência das colunas de data/hora (se não existirem, cria vazias)
if 'date_purchase' not in df.columns:
    df['date_purchase'] = pd.NA
if 'time_purchase' not in df.columns:
    df['time_purchase'] = pd.NA

# Normaliza strings e trata nulos
df['date_purchase'] = df['date_purchase'].astype(str).str.strip().replace({'nan': pd.NA, 'NaN': pd.NA})
df['time_purchase'] = df['time_purchase'].astype(str).str.strip().replace({'nan': pd.NA, 'NaN': pd.NA})

# Preenche nulos com padrões seguros
df['date_purchase'] = df['date_purchase'].fillna('1900-01-01')
df['time_purchase'] = df['time_purchase'].fillna('00:00:00')

# Cria coluna única de datetime (tenta primeiro o formato padrão; se falhar, tenta inferência)
purchase_dt_raw = df['date_purchase'] + ' ' + df['time_purchase']

# 1) Tenta o formato ISO típico do dicionário: YYYY-MM-DD HH:MM:SS
purchase_dt = pd.to_datetime(purchase_dt_raw, format='%Y-%m-%d %H:%M:%S', errors='coerce')

# 2) Para o que ficou NaT, tenta inferência automática (aceita variações como DD/MM/YYYY, etc.)
mask_nat = purchase_dt.isna()
if mask_nat.any():
    purchase_dt.loc[mask_nat] = pd.to_datetime(purchase_dt_raw[mask_nat], dayfirst=False, errors='coerce')
    # Última tentativa com dayfirst=True (cobre CSVs pt-BR com 31/12/2018)
    mask_nat2 = purchase_dt.isna()
    if mask_nat2.any():
        purchase_dt.loc[mask_nat2] = pd.to_datetime(purchase_dt_raw[mask_nat2], dayfirst=True, errors='coerce')

df['purchase_datetime'] = purchase_dt

# Cria uma feature para identificar se a viagem é de ida e volta
# A coluna 'place_origin_return' recebe '0' quando não há retorno
if 'place_origin_return' not in df.columns:
    df['place_origin_return'] = '0'
df['is_round_trip'] = (df['place_origin_return'].astype(str) != '0').astype(int)

# Conversões numéricas seguras (caso venham como string com vírgula/ponto)
def to_numeric_safe(s):
    if s.dtype == object:
        s = s.str.replace('.', '', regex=False).str.replace(',', '.', regex=False)
    return pd.to_numeric(s, errors='coerce')

for col in ['gmv_success', 'total_tickets_quantity_success']:
    if col in df.columns:
        df[col] = to_numeric_safe(df[col])
    else:
        # Se a coluna não existir, cria com 0 para não quebrar a agregação
        df[col] = 0.0

# Identificador do cliente
if 'fk_contact' not in df.columns:
    # Cria um id sintético se faltar (evita quebrar a agregação)
    df['fk_contact'] = 'cliente_desconhecido'

# Remove linhas SEM datetime válido (não é possível calcular recência sem data)
before = len(df)
df = df[~df['purchase_datetime'].isna()].copy()
removed = before - len(df)

print("Dados carregados e limpos com sucesso.")
if removed > 0:
    print(f"Aviso: {removed} linha(s) removida(s) por data/hora inválida(s).")
print(df[['date_purchase', 'time_purchase', 'purchase_datetime']].head())

# ==============================================================================
#               ENGENHARIA DE ATRIBUTOS (FEATURE ENGINEERING)
# ==============================================================================

# O objetivo é criar um perfil para cada cliente com base em seu histórico.
# Para isso, vamos agrupar os dados por cliente (fk_contact).

hoje = df['purchase_datetime'].max() + pd.Timedelta(days=1)

df_clientes = df.groupby('fk_contact').agg(
    # Recência: Há quantos dias foi a última compra?
    recencia_dias=('purchase_datetime', lambda date: (hoje - date.max()).days),

    # Frequência: Quantas compras (pedidos) o cliente já fez?
    frequencia=('nk_ota_localizer_id', 'nunique') if 'nk_ota_localizer_id' in df.columns else ('fk_contact', 'count'),

    # Valor Monetário: Qual o valor total que o cliente já gastou?
    # Usando a coluna 'gmv_success'
    valor_monetario_total=('gmv_success', 'sum'),

    # Média de passagens por compra: O cliente costuma viajar sozinho ou em grupo?
    # Usando a coluna 'total_tickets_quantity_success'
    media_passagens_por_compra=('total_tickets_quantity_success', 'mean'),

    # Proporção de viagens de ida e volta
    pct_viagens_ida_volta=('is_round_trip', 'mean')
).reset_index()

# Renomeia a coluna de id do cliente para um nome genérico, facilitando a integração com a API
df_clientes.rename(columns={'fk_contact': 'id_cliente'}, inplace=True)

print("\nEngenharia de atributos concluída.")
print(df_clientes.head())

# ==============================================================================
#                PRÉ-PROCESSAMENTO E MODELAGEM (CLUSTERIZAÇÃO)
# ==============================================================================

# Seleciona as features que serão usadas pelo modelo de Machine Learning
features_cols = ['recencia_dias', 'frequencia', 'valor_monetario_total', 'media_passagens_por_compra', 'pct_viagens_ida_volta']
features = df_clientes[features_cols].copy()

# Preenche NaNs que possam ter surgido (ex.: clientes com dados faltantes)
features = features.fillna(0)

# Normalizar os dados
#  Nota: Algoritmos de clusterização são sensíveis a diferentes escalas.
scaler = StandardScaler()
features_scaled = scaler.fit_transform(features)

# Treinamento do Modelo K-Means
#    Usaremos 6 clusters para experimentos.
#    Em versões mais antigas do sklearn, use n_init=10; em versões novas, 'auto' funciona bem.
kmeans = KMeans(n_clusters=6, random_state=42, n_init='auto')
df_clientes['segmento'] = kmeans.fit_predict(features_scaled)

# Análise dos Segmentos (para gerar os nomes das personas)
segment_profile = df_clientes.groupby('segmento')[features_cols].mean()

print("\nPerfil dos Segmentos:")
print(segment_profile)

# ==============================================================================
#               SALVAR OS ARTEFATOS (MODELO, SCALER E DADOS)
# ==============================================================================

# Arredondar as colunas de ponto flutuante para melhor legibilidade
df_clientes['valor_monetario_total'] = df_clientes['valor_monetario_total'].round(2)
df_clientes['media_passagens_por_compra'] = df_clientes['media_passagens_por_compra'].round(2)
df_clientes['pct_viagens_ida_volta'] = df_clientes['pct_viagens_ida_volta'].round(4)

# Salvar o modelo treinado
joblib.dump(kmeans, 'kmeans_model.pkl')

# Salvar o normalizador
joblib.dump(scaler, 'scaler.pkl')

# Salvar o CSV com formatação para o padrão brasileiro
# decimal=',' -> Usa vírgula para separar as casas decimais.
# sep=';'     -> Usa ponto-e-vírgula para separar as colunas.
df_clientes.to_csv(
    'clientes_segmentados.csv',
    index=False,
    decimal=',',
    sep=';'
)

print("\nModelo, scaler e dados segmentados foram salvos com sucesso!")
