type HTTP_METHOD = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

async function fetchJSON<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { ...init, cache: "no-store" })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`[${res.status}] ${res.statusText} ${body}`)
  }
  return res.json() as Promise<T>
}

// —— Endpoints do Next (proxy) ——
export const api = {
  // KPIs do dashboard
  kpis: <T=any>() => fetchJSON<T>("/api/kpis"),

  // Segmentos (lista)
  segments: <T=any>(qs = "") => fetchJSON<T>(`/api/segments${qs}`),

  // Resumo/agrupados por segmento
  summary:  <T=any>() => fetchJSON<T>("/api/segments/summary"),

  // criados no flask (graficos)
  salesTrend: <T=any>() => fetchJSON<T>("/api/sales/trend"),
  funnel:     <T=any>() => fetchJSON<T>("/api/funnel"),
  regions:    <T=any>() => fetchJSON<T>("/api/regions"),
  performance:    <T=any>() => fetchJSON<T>("/api/performance"),
  hourly:    <T=any>() => fetchJSON<T>("/api/hourly"),
  predictions: <T=any>(qs="") => fetchJSON<T>(`/api/predictions${qs}`),
}
