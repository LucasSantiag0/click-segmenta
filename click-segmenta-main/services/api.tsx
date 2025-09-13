const API_URL = 'http://127.0.0.1:5000';

export async function fetchSegmentsSummary() {
  try {
    const response = await fetch(`${API_URL}/api/segmentos/summary`);
    if (!response.ok) {
      throw new Error('Falha na resposta da rede');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar dados dos segmentos:", error);
    return [];
  }
}// Nova função para buscar os dados dos KPIs
export async function fetchKpiData() {
  try {
    const response = await fetch(`${API_URL}/api/kpis`);
    if (!response.ok) throw new Error('Falha ao buscar KPIs');
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar dados dos KPIs:", error);
    // Retorna um objeto padrão em caso de erro para não quebrar o dashboard
    return { totalClientes: 0, ticketMedio: 0, taxaRetencao: 0, previsao7dias: 0 };
  }
}