"use client";
import { useEffect, useState } from "react";

type KPIData = {
  totalClientes: number;
  ticketMedio: number;
  taxaRetencao: number;
  previsao7dias: number;
};
type SummaryRegistro = { segmento: string; tamanho_grupo: number; ticket_medio: number };

export function useClickSegmentaData() {
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [summary, setSummary] = useState<SummaryRegistro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const [k, s] = await Promise.all([
        fetch("/api/kpis", { cache: "no-store" }).then(r => r.json()),
        fetch("/api/segments/summary", { cache: "no-store" }).then(r => r.json()),
      ]);
      setKpis(k);
      setSummary(Array.isArray(s) ? s : []);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao buscar dados");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);
  return { kpis, summary, loading, error, reload: load };
}
