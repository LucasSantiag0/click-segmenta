"use client"

import { KPICard } from "./kpi-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Bar,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Scatter,
  ScatterChart,
  ZAxis,
} from "recharts"
import { Users, DollarSign, Repeat, Calendar, TrendingUp, Target, MapPin, Clock, Activity } from "lucide-react"
import { useFilters } from "@/contexts/filters-context"

const salesData = [
  { month: "Jan", vendas: 4000, previsao: 4200, meta: 4500, clientes: 1200 },
  { month: "Fev", vendas: 3000, previsao: 3100, meta: 3500, clientes: 980 },
  { month: "Mar", vendas: 5000, previsao: 4800, meta: 5200, clientes: 1450 },
  { month: "Abr", vendas: 4500, previsao: 4600, meta: 4800, clientes: 1320 },
  { month: "Mai", vendas: 6000, previsao: 5900, meta: 6200, clientes: 1680 },
  { month: "Jun", vendas: 5500, previsao: 5700, meta: 5800, clientes: 1520 },
]

const conversionFunnelData = [
  { stage: "Visitantes", value: 10000, color: "#0f6de7" },
  { stage: "Interessados", value: 7500, color: "#1e7ef7" },
  { stage: "Consideração", value: 4200, color: "#3b8ef8" },
  { stage: "Intenção", value: 2800, color: "#58a0f9" },
  { stage: "Compra", value: 1850, color: "#f0bd33" },
]

const regionData = [
  { regiao: "Sudeste", clientes: 4500, receita: 12500000, participacao: 45 },
  { regiao: "Nordeste", clientes: 2800, receita: 7200000, participacao: 28 },
  { regiao: "Sul", clientes: 1900, receita: 5800000, participacao: 19 },
  { regiao: "Centro-Oeste", clientes: 800, receita: 2100000, participacao: 8 },
]

const performanceRadarData = [
  { metric: "Conversão", atual: 85, meta: 90 },
  { metric: "Retenção", atual: 92, meta: 95 },
  { metric: "Satisfação", atual: 88, meta: 85 },
  { metric: "NPS", atual: 76, meta: 80 },
  { metric: "Ticket Médio", atual: 82, meta: 85 },
  { metric: "Frequência", atual: 79, meta: 75 },
]

const hourlyData = [
  { hora: "00h", compras: 23, conversao: 2.1 },
  { hora: "03h", compras: 12, conversao: 1.8 },
  { hora: "06h", compras: 45, conversao: 3.2 },
  { hora: "09h", compras: 156, conversao: 8.4 },
  { hora: "12h", compras: 234, conversao: 12.1 },
  { hora: "15h", compras: 198, conversao: 9.8 },
  { hora: "18h", compras: 287, conversao: 15.2 },
  { hora: "21h", compras: 176, conversao: 11.3 },
]

const cohortData = [
  { semana: "S1", retencao: 100, novos: 1200 },
  { semana: "S2", retencao: 85, novos: 1020 },
  { semana: "S3", retencao: 72, novos: 864 },
  { semana: "S4", retencao: 68, novos: 816 },
  { semana: "S5", retencao: 65, novos: 780 },
  { semana: "S6", retencao: 62, novos: 744 },
]

const scatterData = [
  { ticket: 1200, frequencia: 2.1, segmento: "Econômicos", size: 120 },
  { ticket: 1800, frequencia: 3.2, segmento: "Espontâneos", size: 180 },
  { ticket: 3200, frequencia: 4.8, segmento: "Planejadores", size: 320 },
  { ticket: 5400, frequencia: 6.2, segmento: "Premium", size: 540 },
]

export function DashboardMain() {
  const { filters } = useFilters()

  return (
    <div className="space-y-6">
      {/* Indicador de Filtros Ativos */}
      {Object.keys(filters).some((key) => {
        const value = filters[key as keyof typeof filters]
        if (key === "probabilidadeMin" && value === 70) return false
        if (key === "ticketMin" && value === 1000) return false
        return value !== undefined && value !== ""
      }) && (
        <div className="mb-4 p-3 bg-cs-blue/10 border border-cs-blue/30 rounded-lg">
          <p className="text-cs-blue text-sm">📊 Dashboard filtrado - Os dados abaixo refletem os filtros aplicados</p>
        </div>
      )}

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total de Clientes"
          value="12,847"
          change="+12% vs mês anterior"
          changeType="positive"
          icon={Users}
          description="Distribuídos em 4 segmentos"
        />
        <KPICard
          title="Ticket Médio"
          value="R$ 2.847"
          change="+8% vs mês anterior"
          changeType="positive"
          icon={DollarSign}
          description="Por grupo de clientes"
        />
        <KPICard
          title="Taxa de Retenção"
          value="87.3%"
          change="+2.1% vs mês anterior"
          changeType="positive"
          icon={Repeat}
          description="Últimos 90 dias"
        />
        <KPICard
          title="Previsão 7 dias"
          value="1,247"
          change="Compras previstas"
          changeType="neutral"
          icon={Calendar}
          description="Próxima semana"
        />
      </div>

      {/* Primeira linha de gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de Tendência Principal */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cs-blue" />
              Tendência de Vendas vs Meta
            </CardTitle>
            <CardDescription className="text-cs-gray-400">Comparação entre vendas, previsões e metas</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                vendas: { label: "Vendas Reais", color: "#0f6de7" },
                previsao: { label: "Previsão", color: "#f0bd33" },
                meta: { label: "Meta", color: "#10b981" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Area type="monotone" dataKey="vendas" fill="url(#colorVendas)" stroke="#0f6de7" strokeWidth={2} />
                  <Line type="monotone" dataKey="previsao" stroke="#f0bd33" strokeWidth={2} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="meta" stroke="#10b981" strokeWidth={2} strokeDasharray="10 5" />
                  <defs>
                    <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f6de7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0f6de7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Funil de Conversão */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <Target className="h-5 w-5 text-cs-yellow" />
              Funil de Conversão
            </CardTitle>
            <CardDescription className="text-cs-gray-400">Jornada do cliente até a compra</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conversionFunnelData.map((stage, index) => {
                const percentage = index === 0 ? 100 : (stage.value / conversionFunnelData[0].value) * 100
                const conversionRate = index === 0 ? 100 : (stage.value / conversionFunnelData[index - 1].value) * 100

                return (
                  <div key={stage.stage} className="relative">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-cs-white font-medium">{stage.stage}</span>
                      <div className="text-right">
                        <span className="text-cs-white font-bold">{stage.value.toLocaleString()}</span>
                        {index > 0 && (
                          <span className="text-cs-gray-400 text-sm ml-2">({conversionRate.toFixed(1)}%)</span>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-cs-gray-700 rounded-full h-6 relative overflow-hidden">
                      <div
                        className="h-6 rounded-full transition-all duration-500 flex items-center justify-center"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: stage.color,
                        }}
                      >
                        <span className="text-white text-xs font-medium">{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segunda linha de gráficos */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Distribuição por Região */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-cs-blue" />
              Distribuição Regional
            </CardTitle>
            <CardDescription className="text-cs-gray-400">Clientes por região</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                participacao: { label: "Participação (%)", color: "#0f6de7" },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="participacao"
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${210 + index * 30}, 70%, ${50 + index * 10}%)`} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Performance Radar */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-cs-yellow" />
              Performance vs Meta
            </CardTitle>
            <CardDescription className="text-cs-gray-400">Métricas principais</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                atual: { label: "Atual", color: "#0f6de7" },
                meta: { label: "Meta", color: "#f0bd33" },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={performanceRadarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                  <Radar
                    name="Atual"
                    dataKey="atual"
                    stroke="#0f6de7"
                    fill="#0f6de7"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Meta"
                    dataKey="meta"
                    stroke="#f0bd33"
                    fill="#f0bd33"
                    fillOpacity={0.1}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Análise Horária */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-cs-blue" />
              Padrão Horário
            </CardTitle>
            <CardDescription className="text-cs-gray-400">Compras por horário</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                compras: { label: "Compras", color: "#0f6de7" },
                conversao: { label: "Conversão (%)", color: "#f0bd33" },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hora" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 10 }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar yAxisId="left" dataKey="compras" fill="#0f6de7" radius={[2, 2, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="conversao" stroke="#f0bd33" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Terceira linha de gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Análise de Coorte */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <Users className="h-5 w-5 text-cs-blue" />
              Análise de Coorte - Retenção
            </CardTitle>
            <CardDescription className="text-cs-gray-400">Retenção de clientes ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                retencao: { label: "Retenção (%)", color: "#0f6de7" },
                novos: { label: "Novos Clientes", color: "#f0bd33" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={cohortData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="semana" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="retencao"
                    stroke="#0f6de7"
                    fill="url(#colorRetencao)"
                    strokeWidth={2}
                  />
                  <Bar yAxisId="right" dataKey="novos" fill="#f0bd33" opacity={0.7} radius={[2, 2, 0, 0]} />
                  <defs>
                    <linearGradient id="colorRetencao" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f6de7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0f6de7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Scatter Plot - Ticket vs Frequência */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <Target className="h-5 w-5 text-cs-yellow" />
              Ticket Médio vs Frequência
            </CardTitle>
            <CardDescription className="text-cs-gray-400">Correlação por segmento de cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                economicos: { label: "Econômicos", color: "#10b981" },
                espontaneos: { label: "Espontâneos", color: "#f0bd33" },
                planejadores: { label: "Planejadores", color: "#0f6de7" },
                premium: { label: "Premium", color: "#8b5cf6" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    type="number"
                    dataKey="ticket"
                    name="Ticket Médio"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    domain={[1000, 6000]}
                  />
                  <YAxis
                    type="number"
                    dataKey="frequencia"
                    name="Frequência"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    domain={[1, 7]}
                  />
                  <ZAxis type="number" dataKey="size" range={[50, 400]} />
                  <ChartTooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Scatter data={scatterData.filter((d) => d.segmento === "Econômicos")} fill="#10b981" />
                  <Scatter data={scatterData.filter((d) => d.segmento === "Espontâneos")} fill="#f0bd33" />
                  <Scatter data={scatterData.filter((d) => d.segmento === "Planejadores")} fill="#0f6de7" />
                  <Scatter data={scatterData.filter((d) => d.segmento === "Premium")} fill="#8b5cf6" />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
