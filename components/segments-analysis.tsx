"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Users, ShoppingBag, Clock, Zap, TrendingUp, Target, Activity } from "lucide-react"
import { useFilters } from "@/contexts/filters-context"

const segmentData = [
  { name: "Planejadores", value: 35, color: "#0f6de7", customers: 4496 },
  { name: "Espontâneos", value: 28, color: "#f0bd33", customers: 3597 },
  { name: "Econômicos", value: 22, color: "#10b981", customers: 2826 },
  { name: "Premium", value: 15, color: "#8b5cf6", customers: 1928 },
]

const segmentDetails = [
  {
    name: "Planejadores",
    icon: Clock,
    description: "Clientes que planejam compras com antecedência",
    avgTicket: "R$ 3.200",
    retention: "92%",
    color: "#0f6de7",
  },
  {
    name: "Espontâneos",
    icon: Zap,
    description: "Compras por impulso e oportunidades",
    avgTicket: "R$ 1.800",
    retention: "78%",
    color: "#f0bd33",
  },
  {
    name: "Econômicos",
    icon: ShoppingBag,
    description: "Focados em preço e promoções",
    avgTicket: "R$ 1.200",
    retention: "85%",
    color: "#10b981",
  },
  {
    name: "Premium",
    icon: Users,
    description: "Buscam experiências exclusivas",
    avgTicket: "R$ 5.400",
    retention: "95%",
    color: "#8b5cf6",
  },
]

const segmentEvolutionData = [
  { month: "Jan", Planejadores: 32, Espontâneos: 30, Econômicos: 25, Premium: 13 },
  { month: "Fev", Planejadores: 33, Espontâneos: 29, Econômicos: 24, Premium: 14 },
  { month: "Mar", Planejadores: 34, Espontâneos: 28, Econômicos: 23, Premium: 15 },
  { month: "Abr", Planejadores: 35, Espontâneos: 28, Econômicos: 22, Premium: 15 },
  { month: "Mai", Planejadores: 35, Espontâneos: 28, Econômicos: 22, Premium: 15 },
  { month: "Jun", Planejadores: 35, Espontâneos: 28, Econômicos: 22, Premium: 15 },
]

const segmentMetricsRadar = [
  { metric: "Frequência", Planejadores: 85, Espontâneos: 65, Econômicos: 70, Premium: 90 },
  { metric: "Ticket Médio", Planejadores: 75, Espontâneos: 45, Econômicos: 30, Premium: 100 },
  { metric: "Retenção", Planejadores: 92, Espontâneos: 78, Econômicos: 85, Premium: 95 },
  { metric: "Satisfação", Planejadores: 88, Espontâneos: 82, Econômicos: 79, Premium: 96 },
  { metric: "Conversão", Planejadores: 82, Espontâneos: 75, Econômicos: 68, Premium: 89 },
]

const segmentBehaviorData = [
  { segment: "Planejadores", manha: 45, tarde: 35, noite: 20, madrugada: 5 },
  { segment: "Espontâneos", manha: 25, tarde: 40, noite: 30, madrugada: 5 },
  { segment: "Econômicos", manha: 35, tarde: 45, noite: 15, madrugada: 5 },
  { segment: "Premium", manha: 20, tarde: 30, noite: 40, madrugada: 10 },
]

const channelPreferenceData = [
  { channel: "Website", Planejadores: 65, Espontâneos: 45, Econômicos: 70, Premium: 40 },
  { channel: "Mobile App", Planejadores: 25, Espontâneos: 40, Econômicos: 20, Premium: 35 },
  { channel: "Telefone", Planejadores: 8, Espontâneos: 10, Econômicos: 8, Premium: 20 },
  { channel: "Loja Física", Planejadores: 2, Espontâneos: 5, Econômicos: 2, Premium: 5 },
]

const treemapData = [
  { name: "Planejadores", size: 4496, revenue: 14387200, color: "#0f6de7" },
  { name: "Espontâneos", size: 3597, revenue: 6474600, color: "#f0bd33" },
  { name: "Econômicos", size: 2826, revenue: 3391200, color: "#10b981" },
  { name: "Premium", size: 1928, revenue: 10411200, color: "#8b5cf6" },
]

export function SegmentsAnalysis() {
  const { filters } = useFilters()

  return (
    <div className="space-y-6">
      {/* Indicador de Filtros */}
      {filters.segmento && (
        <div className="mb-4 p-3 bg-cs-blue/10 border border-cs-blue/30 rounded-lg">
          <p className="text-cs-blue text-sm">🎯 Análise filtrada para: {filters.segmento}</p>
        </div>
      )}

      {/* Primeira linha - Visão Geral */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Gráfico de Pizza */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white">Distribuição de Segmentos</CardTitle>
            <CardDescription className="text-cs-gray-400">Percentual de clientes por segmento</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                planejadores: { label: "Planejadores", color: "#0f6de7" },
                espontaneos: { label: "Espontâneos", color: "#f0bd33" },
                economicos: { label: "Econômicos", color: "#10b981" },
                premium: { label: "Premium", color: "#8b5cf6" },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {segmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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

        {/* Gráfico de Barras */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white">Clientes por Segmento</CardTitle>
            <CardDescription className="text-cs-gray-400">Número absoluto de clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                customers: { label: "Clientes", color: "#0f6de7" },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={segmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="customers" radius={[4, 4, 0, 0]}>
                    {segmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Receita por Segmento - Substituindo Treemap */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white">Receita por Segmento</CardTitle>
            <CardDescription className="text-cs-gray-400">Contribuição para receita total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {treemapData.map((segment, index) => {
                const percentage = (segment.revenue / treemapData.reduce((sum, s) => sum + s.revenue, 0)) * 100
                return (
                  <div key={segment.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                        <span className="text-cs-white font-medium">{segment.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-cs-white font-bold">R$ {(segment.revenue / 1000000).toFixed(1)}M</div>
                        <div className="text-cs-gray-400 text-xs">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-cs-gray-700 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: segment.color,
                        }}
                      />
                    </div>
                    <div className="text-xs text-cs-gray-400">{segment.size.toLocaleString()} clientes</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segunda linha - Evolução Temporal */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Evolução dos Segmentos */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cs-blue" />
              Evolução dos Segmentos
            </CardTitle>
            <CardDescription className="text-cs-gray-400">Mudança na distribuição ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                Planejadores: { label: "Planejadores", color: "#0f6de7" },
                Espontâneos: { label: "Espontâneos", color: "#f0bd33" },
                Econômicos: { label: "Econômicos", color: "#10b981" },
                Premium: { label: "Premium", color: "#8b5cf6" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={segmentEvolutionData}>
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
                  <Area
                    type="monotone"
                    dataKey="Planejadores"
                    stackId="1"
                    stroke="#0f6de7"
                    fill="#0f6de7"
                    fillOpacity={0.8}
                  />
                  <Area
                    type="monotone"
                    dataKey="Espontâneos"
                    stackId="1"
                    stroke="#f0bd33"
                    fill="#f0bd33"
                    fillOpacity={0.8}
                  />
                  <Area
                    type="monotone"
                    dataKey="Econômicos"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.8}
                  />
                  <Area
                    type="monotone"
                    dataKey="Premium"
                    stackId="1"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Radar de Métricas */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-cs-yellow" />
              Comparação de Métricas
            </CardTitle>
            <CardDescription className="text-cs-gray-400">Performance por segmento</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                Planejadores: { label: "Planejadores", color: "#0f6de7" },
                Premium: { label: "Premium", color: "#8b5cf6" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={segmentMetricsRadar}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#9CA3AF", fontSize: 8 }} />
                  <Radar
                    name="Planejadores"
                    dataKey="Planejadores"
                    stroke="#0f6de7"
                    fill="#0f6de7"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Premium"
                    dataKey="Premium"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.2}
                    strokeWidth={2}
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
      </div>

      {/* Terceira linha - Comportamento */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Comportamento por Horário */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-cs-blue" />
              Padrão de Compras por Período
            </CardTitle>
            <CardDescription className="text-cs-gray-400">Distribuição de compras por período do dia</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                manha: { label: "Manhã", color: "#f0bd33" },
                tarde: { label: "Tarde", color: "#0f6de7" },
                noite: { label: "Noite", color: "#8b5cf6" },
                madrugada: { label: "Madrugada", color: "#10b981" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={segmentBehaviorData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="segment"
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
                  <Bar dataKey="manha" stackId="a" fill="#f0bd33" />
                  <Bar dataKey="tarde" stackId="a" fill="#0f6de7" />
                  <Bar dataKey="noite" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="madrugada" stackId="a" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Preferência de Canal */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <Target className="h-5 w-5 text-cs-yellow" />
              Preferência de Canal
            </CardTitle>
            <CardDescription className="text-cs-gray-400">Canal preferido por segmento</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                Planejadores: { label: "Planejadores", color: "#0f6de7" },
                Espontâneos: { label: "Espontâneos", color: "#f0bd33" },
                Econômicos: { label: "Econômicos", color: "#10b981" },
                Premium: { label: "Premium", color: "#8b5cf6" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelPreferenceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="channel" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="Planejadores" fill="#0f6de7" />
                  <Bar dataKey="Espontâneos" fill="#f0bd33" />
                  <Bar dataKey="Econômicos" fill="#10b981" />
                  <Bar dataKey="Premium" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Perfil */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {segmentDetails.map((segment) => (
          <Card key={segment.name} className="bg-cs-dark border-cs-gray-700 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <segment.icon className="h-6 w-6" style={{ color: segment.color }} />
                <div className="text-right">
                  <div className="text-2xl font-bold text-cs-white">{segment.avgTicket}</div>
                  <div className="text-xs text-cs-gray-400">Ticket Médio</div>
                </div>
              </div>
              <CardTitle className="text-cs-white text-lg">{segment.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-cs-gray-400 mb-3">{segment.description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-cs-white">Retenção</div>
                  <div className="text-lg font-bold" style={{ color: segment.color }}>
                    {segment.retention}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-cs-gray-400">Clientes</div>
                  <div className="text-lg font-bold text-cs-white">
                    {segmentData.find((s) => s.name === segment.name)?.customers.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
