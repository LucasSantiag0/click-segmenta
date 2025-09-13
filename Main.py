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

# Converter e combinar data e hora da compra em um único campo datetime
# Colunas de origem: date_purchase, time_purchase
df['purchase_datetime'] = pd.to_datetime(df['date_purchase'] + ' ' + df['time_purchase'])

# Cria uma feature para identificar se a viagem é de ida e volta
# A coluna 'place_origin_return' recebe '0' quando não há retorno
df['is_round_trip'] = (df['place_origin_return'] != '0').astype(int)

print("Dados carregados e limpos com sucesso.")
print(df.head())

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
    frequencia=('nk_ota_localizer_id', 'nunique'),

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
features = df_clientes[
    ['recencia_dias', 'frequencia', 'valor_monetario_total', 'media_passagens_por_compra', 'pct_viagens_ida_volta']]

# Normalizar os dados
#  Nota: Algoritmos de clusterização são sensíveis a diferentes escalas.
scaler = StandardScaler()
features_scaled = scaler.fit_transform(features)

# Treinamento do Modelo K-Means
#    Usaremos 6 clusters para experimentos.
kmeans = KMeans(n_clusters=6, random_state=42, n_init='auto')
df_clientes['segmento'] = kmeans.fit_predict(features_scaled)

# Análise dos Segmentos (para gerar os nomes das personas)
segment_profile = df_clientes.groupby('segmento')[
    ['recencia_dias', 'frequencia', 'valor_monetario_total', 'media_passagens_por_compra',
     'pct_viagens_ida_volta']].mean()

print("\nPerfil dos Segmentos:")
print(segment_profile)

# ==============================================================================
#               SALVAR OS ARTEFATOS (MODELO, SCALER E DADOS)
# ==============================================================================

# Arredondar as colunas de ponto flutuante para melhor legibilidade
df_clientes['valor_monetario_total'] = df_clientes['valor_monetario_total'].round(2)
df_clientes['media_passagens_por_compra'] = df_clientes['media_passagens_por_compra'].round(2)
df_clientes['pct_viagens_ida_volta'] = df_clientes['pct_viagens_ida_volta'].round(4) # Mais precisão para porcentagens

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