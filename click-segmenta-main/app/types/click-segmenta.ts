export type KPIData = {
  totalClientes: number;
  ticketMedio: number;
  taxaRetencao: number;
  previsao7dias: number;
};

export type SegmentoRegistro = {
  id_cliente: number | string;
  segmento: string;
  valor_monetario_total: number;
  [key: string]: any;
};

export type SummaryRegistro = {
  segmento: string;
  tamanho_grupo: number;
  ticket_medio: number;
};
