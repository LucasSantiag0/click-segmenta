import type { SegmentoRegistro } from "@/types/click-segmenta";

export function adaptSegmentRow(r: any): SegmentoRegistro {
  return {
    id_cliente: r.id_cliente ?? r.id ?? r.cliente_id,
    segmento: r.segmento ?? r.cluster ?? "Desconhecido",
    valor_monetario_total: Number(r.valor_monetario_total ?? r.valor ?? 0),
    ...r,
  };
}
