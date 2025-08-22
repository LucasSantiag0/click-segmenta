"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"
import { Eye, Mail, Phone, TrendingUp, Users, Target, Calendar, Activity } from "lucide-react"
import { useFilters } from "@/contexts/filters-context"

const predictionsData = [
  {
    id: 1,
    cliente: "Maria Silva",
    email: "maria.silva@email.com",
    probabilidade: 92,
    dataPrevisao: "2024-01-15",
    rota: "São Paulo → Rio de Janeiro",
    ticketEstimado: "R$ 2.400",
    segmento: "Planejadores",
  },
  {
    id: 2,
    cliente: "João Santos",
    email: "joao.santos@email.com",
    probabilidade: 87,
    dataPrevisao: "2024-01-16",
    rota: "Brasília → Salvador",
    ticketEstimado: "R$ 1.800",
    segmento: "Espontâneos",
  },
  {
    id: 3,
    cliente: "Ana Costa",
    email: "ana.costa@email.com",
    probabilidade: 78,
    dataPrevisao: "2024-01-17",
    rota: "Belo Horizonte → Fortaleza",
    ticketEstimado: "R$ 3.200",
    segmento: "Premium",
  },
  {
    id: 4,
    cliente: "Pedro Lima",
    email: "pedro.lima@email.com",
    probabilidade: 85,
    dataPrevisao: "2024-01-18",
    rota: "Porto Alegre → Recife",
    ticketEstimado: "R$ 1.200",
    segmento: "Econômicos",
  },
  {
    id: 5,
    cliente: "Carla Oliveira",
    email: "carla.oliveira@email.com",
    probabilidade: 91,
    dataPrevisao: "2024-01-19",
    rota: "Curitiba → Manaus",
    ticketEstimado: "R$ 2.800",
    segmento: "Planejadores",
  },
]

const probabilityDistribution = [
  { range: "90-100%", count: 245, color: "#10b981" },
  { range: "80-89%", count: 387, color: "#f0bd33" },
  { range: "70-79%", count: 456, color: "#f97316" },
  { range: "60-69%", count: 298, color: "#ef4444" },
]

const predictionAccuracy = [
  { week: "S1", predicted: 245, actual: 238, accuracy: 97.1 },
  { week: "S2", predicted: 287, actual: 294, accuracy: 97.6 },
  { week: "S3", predicted: 312, actual: 301, accuracy: 96.5 },
  { week: "S4", predicted: 298, actual: 289, accuracy: 97.0 },
  { week: "S5", predicted: 334, actual: 342, accuracy: 97.7 },
  { week: "S6", predicted: 289, actual: 276, accuracy: 95.5 },
]

const timelineData = [
  { day: "Hoje", predictions: 89, conversions: 76 },
  { day: "Amanhã", predictions: 94, conversions: 0 },
  { day: "+2 dias", predictions: 87, conversions: 0 },
  { day: "+3 dias", predictions: 92, conversions: 0 },
  { day: "+4 dias", predictions: 78, conversions: 0 },
  { day: "+5 dias", predictions: 85, conversions: 0 },
  { day: "+6 dias", predictions: 91, conversions: 0 },
]

const segmentPredictions = [
  { segment: "Planejadores", predictions: 156, avgProb: 89, color: "#0f6de7" },
  { segment: "Premium", predictions: 89, avgProb: 92, color: "#8b5cf6" },
  { segment: "Espontâneos", predictions: 134, avgProb: 82, color: "#f0bd33" },
  { segment: "Econômicos", predictions: 98, avgProb: 76, color: "#10b981" },
]

const modelPerformance = [
  { metric: "Precisão", value: 94.2, target: 90 },
  { metric: "Recall", value: 91.8, target: 85 },
  { metric: "F1-Score", value: 93.0, target: 87 },
  { metric: "AUC-ROC", value: 96.5, target: 92 },
]

const getSegmentColor = (segmento: string) => {
  const colors = {
    Planejadores: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Espontâneos: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Econômicos: "bg-green-500/20 text-green-400 border-green-500/30",
    Premium: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  }
  return colors[segmento as keyof typeof colors] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
}

const getProbabilityColor = (prob: number) => {
  if (prob >= 90) return "text-green-400"
  if (prob >= 80) return "text-yellow-400"
  if (prob >= 70) return "text-orange-400"
  return "text-red-400"
}

export function PredictionsTable() {
  const { filters } = useFilters()

  return (
    <div className="space-y-6">
      {/* Indicador de Filtros */}
      {Object.keys(filters).some((key) => {
        const value = filters[key as keyof typeof filters]
        if (key === "probabilidadeMin" && value === 70) return false
        if (key === "ticketMin" && value === 1000) return false
        return value !== undefined && value !== ""
      }) && (
        <div className="mb-4 p-3 bg-cs-blue/10 border border-cs-blue/30 rounded-lg">
          <p className="text-cs-blue text-sm">🎯 Previsões filtradas - Dados ajustados aos filtros aplicados</p>
        </div>
      )}

      {/* Primeira linha de gráficos */}
      <div className="grid gap-6 md:grid-cols-4">
        {/* Distribuição de Probabilidades */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <Target className="h-5 w-5 text-cs-blue" />
              Distribuição de Probabilidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Quantidade", color: "#0f6de7" },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={probabilityDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                    {probabilityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Acurácia do Modelo */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-cs-yellow" />
              Acurácia do Modelo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                accuracy: { label: "Acurácia (%)", color: "#10b981" },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictionAccuracy}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                  <YAxis domain={[94, 98]} axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Timeline de Previsões */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cs-blue" />
              Timeline - Próximos 7 Dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                predictions: { label: "Previsões", color: "#0f6de7" },
                conversions: { label: "Conversões", color: "#10b981" },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 10 }} />
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
                    dataKey="predictions"
                    stroke="#0f6de7"
                    fill="url(#colorPredictions)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="conversions"
                    stroke="#10b981"
                    fill="url(#colorConversions)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="colorPredictions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f6de7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0f6de7" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Previsões por Segmento */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <Users className="h-5 w-5 text-cs-yellow" />
              Previsões por Segmento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                predictions: { label: "Previsões", color: "#0f6de7" },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segmentPredictions}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="predictions"
                  >
                    {segmentPredictions.map((entry, index) => (
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
      </div>

      {/* Segunda linha - Performance do Modelo */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Métricas de Performance */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cs-blue" />
              Performance do Modelo de ML
            </CardTitle>
            <CardDescription className="text-cs-gray-400">Métricas de qualidade das previsões</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modelPerformance.map((metric) => (
                <div key={metric.metric} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-cs-white font-medium">{metric.metric}</span>
                    <div className="text-right">
                      <span className="text-cs-white font-bold">{metric.value}%</span>
                      <span className="text-cs-gray-400 text-sm ml-2">(Meta: {metric.target}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-cs-gray-700 rounded-full h-3">
                    <div className="relative h-3 rounded-full overflow-hidden">
                      <div
                        className="h-3 bg-cs-blue rounded-full transition-all duration-500"
                        style={{ width: `${(metric.value / 100) * 100}%` }}
                      />
                      <div className="absolute top-0 h-3 w-1 bg-cs-yellow" style={{ left: `${metric.target}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scatter Plot - Probabilidade vs Ticket */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <Target className="h-5 w-5 text-cs-yellow" />
              Probabilidade vs Ticket Estimado
            </CardTitle>
            <CardDescription className="text-cs-gray-400">Correlação entre probabilidade e valor</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                scatter: { label: "Clientes", color: "#0f6de7" },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    type="number"
                    dataKey="probabilidade"
                    name="Probabilidade"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    domain={[60, 100]}
                  />
                  <YAxis
                    type="number"
                    dataKey="ticket"
                    name="Ticket"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    domain={[1000, 6000]}
                  />
                  <ZAxis type="number" range={[50, 200]} />
                  <ChartTooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Scatter
                    data={predictionsData.map((p) => ({
                      probabilidade: p.probabilidade,
                      ticket: Number.parseInt(p.ticketEstimado.replace(/[R$\s.]/g, "")),
                      segmento: p.segmento,
                    }))}
                    fill="#0f6de7"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Previsões */}
      <Card className="bg-cs-dark border-cs-gray-700">
        <CardHeader>
          <CardTitle className="text-cs-white">Previsões Individuais</CardTitle>
          <CardDescription className="text-cs-gray-400">
            Clientes com maior probabilidade de compra nos próximos 7 dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cs-gray-700">
                  <th className="text-left py-3 px-4 text-cs-gray-300 font-medium">Cliente</th>
                  <th className="text-left py-3 px-4 text-cs-gray-300 font-medium">Probabilidade</th>
                  <th className="text-left py-3 px-4 text-cs-gray-300 font-medium">Data Prevista</th>
                  <th className="text-left py-3 px-4 text-cs-gray-300 font-medium">Rota</th>
                  <th className="text-left py-3 px-4 text-cs-gray-300 font-medium">Ticket Est.</th>
                  <th className="text-left py-3 px-4 text-cs-gray-300 font-medium">Segmento</th>
                  <th className="text-left py-3 px-4 text-cs-gray-300 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {predictionsData.map((prediction) => (
                  <tr
                    key={prediction.id}
                    className="border-b border-cs-gray-800 hover:bg-cs-gray-800/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-cs-white">{prediction.cliente}</div>
                        <div className="text-sm text-cs-gray-400">{prediction.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className={`text-lg font-bold ${getProbabilityColor(prediction.probabilidade)}`}>
                        {prediction.probabilidade}%
                      </div>
                    </td>
                    <td className="py-4 px-4 text-cs-white">
                      {new Date(prediction.dataPrevisao).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-cs-white font-medium">{prediction.rota}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-cs-yellow font-bold">{prediction.ticketEstimado}</div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getSegmentColor(prediction.segmento)}>{prediction.segmento}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" className="cs-button-primary h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="cs-button-secondary h-8 w-8 p-0">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 border-cs-gray-600 hover:bg-cs-gray-700"
                        >
                          <Phone className="h-4 w-4 text-cs-gray-300" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
