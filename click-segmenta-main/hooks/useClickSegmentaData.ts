"use client";
import { useEffect, useState } from "react";

// Tipos de dados
type KPIData = {
  totalClientes: number;
  ticketMedio: number;
  taxaRetencao: number;
  previsao7dias: number;
};
type SummaryRegistro = { 
  segmento: number; // Alterado para number para corresponder à API
  tamanho_grupo: number; 
  ticket_medio: number 
};
type CustomerDistributionPoint = {
  id_cliente: string | number;
  frequencia: number;
  valor: number;
  segmento: string;
};
type RadarDataPoint = {
  metric: string;
  [key: string]: string | number;
};

export function useClickSegmentaData() {
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [summary, setSummary] = useState<SummaryRegistro[]>([]);
  const [customerDistribution, setCustomerDistribution] = useState<CustomerDistributionPoint[]>([]);
  const [radarData, setRadarData] = useState<RadarDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      // Busca os dados para TODOS os gráficos dinâmicos em paralelo
      const [k, s, cd, rd] = await Promise.all([
        fetch("/api/kpis", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/segments/summary", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/charts/customer_distribution_scatter", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/charts/segment_comparison_radar", { cache: "no-store" }).then((r) => r.json()),
      ]);

      setKpis(k);
      setSummary(Array.isArray(s) ? s : []);
      setCustomerDistribution(Array.isArray(cd) ? cd : []);
      setRadarData(Array.isArray(rd) ? rd : []);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao buscar dados da API");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  // Retorna TODOS os dados para o dashboard
  return { kpis, summary, customerDistribution, radarData, loading, error, reload: load };
}

