// nomes amigáveis para os clusters (0..5)
export const SEGMENT_NAMES: Record<string, string> = {
  "0": "Trecho Único Recorrente",
  "1": "Planejadores Ida & Volta",
  "2": "Ultra-VIP / Corporativo",
  "3": "Super-Frequentes Recentes",
  "4": "Inativos Econômicos",
  "5": "Regulares de Alto Valor",
};

// paleta opcional para chips/legendas
export const SEGMENT_COLORS: Record<string, string> = {
  "0": "#0EA5E9", // azul
  "1": "#F59E0B", // âmbar
  "2": "#8B5CF6", // roxo
  "3": "#10B981", // verde
  "4": "#6B7280", // cinza
  "5": "#EF4444", // vermelho
};

export function getSegmentLabel(id: number | string): string {
  const k = String(id);
  return SEGMENT_NAMES[k] ?? `Segmento ${k}`;
}

export function getSegmentColor(id: number | string): string {
  const k = String(id);
  return SEGMENT_COLORS[k] ?? "#94A3B8"; // slate-400 fallback
}

// para selects/filtros
export function segmentOptions() {
  return Object.keys(SEGMENT_NAMES).map((k) => ({
    value: Number(k),
    label: SEGMENT_NAMES[k],
  }));
}
