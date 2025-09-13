"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Users, TrendingUp, DollarSign, Target, Activity, Zap } from "lucide-react"
import { useFilters } from "@/contexts/filters-context"

// Dados simulados de clientes
const allClients = [
  {
    id: 1,
    probabilidade: 95,
    ticketEstimado: 3200,
    segmento: "Planejadores",
    origem: "São Paulo",
    destino: "Rio de Janeiro",
    retencao: 92,
    dataPrevisao: "2024-01-15",
  },
  {
    id: 2,
    probabilidade: 87,
    ticketEstimado: 1800,
    segmento: "Espontâneos",
    origem: "Brasília",
    destino: "Salvador",
    retencao: 78,
    dataPrevisao: "2024-01-16",
  },
  {
    id: 3,
    probabilidade: 92,
    ticketEstimado: 5400,
    segmento: "Premium",
    origem: "Belo Horizonte",
    destino: "Fortaleza",
    retencao: 95,
    dataPrevisao: "2024-01-17",
  },
  {
    id: 4,
    probabilidade: 73,
    ticketEstimado: 1200,
    segmento: "Econômicos",
    origem: "Porto Alegre",
    destino: "Recife",
    retencao: 85,
    dataPrevisao: "2024-01-18",
  },
  {
    id: 5,
    probabilidade: 89,
    ticketEstimado: 2800,
    segmento: "Planejadores",
    origem: "Curitiba",
    destino: "Manaus",
    retencao: 92,
    dataPrevisao: "2024-01-19",
  },
  {
    id: 6,
    probabilidade: 96,
    ticketEstimado: 4200,
    segmento: "Premium",
    origem: "São Paulo",
    destino: "Brasília",
    retencao: 98,
    dataPrevisao: "2024-01-20",
  },
  {
    id: 7,
    probabilidade: 81,
    ticketEstimado: 1600,
    segmento: "Espontâneos",
    origem: "Rio de Janeiro",
    destino: "Salvador",
    retencao: 76,
    dataPrevisao: "2024-01-21",
  },
  {
    id: 8,
    probabilidade: 68,
    ticketEstimado: 980,
    segmento: "Econômicos",
    origem: "Fortaleza",
    destino: "São Paulo",
    retencao: 82,
    dataPrevisao: "2024-01-22",
  },
  {
    id: 9,
    probabilidade: 94,
    ticketEstimado: 3800,
    segmento: "Premium",
    origem: "Brasília",
    destino: "Rio de Janeiro",
    retencao: 96,
    dataPrevisao: "2024-01-23",
  },
  {
    id: 10,
    probabilidade: 85,
    ticketEstimado: 2200,
    segmento: "Planejadores",
    origem: "Salvador",
    destino: "São Paulo",
    retencao: 90,
    dataPrevisao: "2024-01-24",
  },
  // Adicionando mais dados para análise mais robusta
  {
    id: 11,
    probabilidade: 91,
    ticketEstimado: 3500,
    segmento: "Premium",
    origem: "São Paulo",
    destino: "Fortaleza",
    retencao: 94,
    dataPrevisao: "2024-01-25",
  },
  {
    id: 12,
    probabilidade: 76,
    ticketEstimado: 1400,
    segmento: "Econômicos",
    origem: "Recife",
    destino: "Brasília",
    retencao: 83,
    dataPrevisao: "2024-01-26",
  },
  {
    id: 13,
    probabilidade: 88,
    ticketEstimado: 2100,
    segmento: "Espontâneos",
    origem: "Belo Horizonte",
    destino: "Porto Alegre",
    retencao: 79,
    dataPrevisao: "2024-01-27",
  },
  {
    id: 14,
    probabilidade: 93,
    ticketEstimado: 3100,
    segmento: "Planejadores",
    origem: "Manaus",
    destino: "São Paulo",
    retencao: 91,
    dataPrevisao: "2024-01-28",
  },
  {
    id: 15,
    probabilidade: 71,
    ticketEstimado: 1100,
    segmento: "Econômicos",
    origem: "Goiânia",
    destino: "Rio de Janeiro",
    retencao: 84,
    dataPrevisao: "2024-01-29",
  },
]

const getClusterName = (probabilidade: number) => {
  if (probabilidade >= 90) return "Alta Propensão"
  if (probabilidade >= 80) return "Média Propensão"
  if (probabilidade >= 70) return "Baixa Propensão"
  return "Muito Baixa"
}

const getClusterColor = (cluster: string) => {
  switch (cluster) {
    case "Alta Propensão":
      return { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30", color: "#10b981" }
    case "Média Propensão":
      return { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30", color: "#f0bd33" }
    case "Baixa Propensão":
      return { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30", color: "#f97316" }
    default:
      return { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30", color: "#ef4444" }
  }
}

const getClusterIcon = (cluster: string) => {
  switch (cluster) {
    case "Alta Propensão":
      return Target
    case "Média Propensão":
      return TrendingUp
    case "Baixa Propensão":
      return Activity
    default:
      return Zap
  }
}

export function ClientsByCluster() {
  const { filters, isFiltered } = useFilters()

  // Filtrar clientes baseado nos filtros aplicados
  const filteredClients = allClients.filter((client) => {
    if (!filters.applied) return true

    if (filters.origem && !client.origem.toLowerCase().includes(filters.origem.toLowerCase())) return false
    if (filters.destino && !client.destino.toLowerCase().includes(filters.destino.toLowerCase())) return false
    if (filters.segmento && !client.segmento.toLowerCase().includes(filters.segmento.toLowerCase())) return false
    if (client.probabilidade < filters.probabilidadeMin) return false
    if (client.ticketEstimado < filters.ticketMin) return false
    if (client.ticketEstimado > filters.ticketMax) return false

    if (filters.retencao) {
      if (filters.retencao === "alta" && client.retencao < 90) return false
      if (filters.retencao === "media" && (client.retencao < 70 || client.retencao >= 90)) return false
      if (filters.retencao === "baixa" && client.retencao >= 70) return false
    }

    return true
  })

  // Agrupar clientes por cluster
  const clientsByCluster = filteredClients.reduce(
    (acc, client) => {
      const cluster = getClusterName(client.probabilidade)
      if (!acc[cluster]) {
        acc[cluster] = []
      }
      acc[cluster].push(client)
      return acc
    },
    {} as Record<string, typeof filteredClients>,
  )

  // Calcular estatísticas por cluster
  const clusterStats = Object.entries(clientsByCluster)
    .map(([cluster, clients]) => {
      const avgTicket = clients.reduce((sum, c) => sum + c.ticketEstimado, 0) / clients.length
      const avgRetention = clients.reduce((sum, c) => sum + c.retencao, 0) / clients.length
      const avgProbability = clients.reduce((sum, c) => sum + c.probabilidade, 0) / clients.length

      // Distribuição por segmento dentro do cluster
      const segmentDistribution = clients.reduce(
        (acc, client) => {
          acc[client.segmento] = (acc[client.segmento] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      return {
        cluster,
        clients,
        count: clients.length,
        avgTicket: Math.round(avgTicket),
        avgRetention: Math.round(avgRetention),
        avgProbability: Math.round(avgProbability),
        totalRevenue: clients.reduce((sum, c) => sum + c.ticketEstimado, 0),
        segmentDistribution,
      }
    })
    .sort((a, b) => b.avgProbability - a.avgProbability)

  const distributionData = clusterStats.map((stat) => ({
    name: stat.cluster,
    value: stat.count,
    color: getClusterColor(stat.cluster).color,
  }))

  // Dados para gráfico de evolução temporal (simulado)
  const evolutionData = [
    { month: "Jan", "Alta Propensão": 45, "Média Propensão": 32, "Baixa Propensão": 18, "Muito Baixa": 5 },
    { month: "Fev", "Alta Propensão": 48, "Média Propensão": 30, "Baixa Propensão": 17, "Muito Baixa": 5 },
    { month: "Mar", "Alta Propensão": 52, "Média Propensão": 28, "Baixa Propensão": 15, "Muito Baixa": 5 },
    { month: "Abr", "Alta Propensão": 55, "Média Propensão": 27, "Baixa Propensão": 14, "Muito Baixa": 4 },
    { month: "Mai", "Alta Propensão": 58, "Média Propensão": 25, "Baixa Propensão": 13, "Muito Baixa": 4 },
    { month: "Jun", "Alta Propensão": 60, "Média Propensão": 24, "Baixa Propensão": 12, "Muito Baixa": 4 },
  ]

  return (
    <div className="space-y-6">
      {/* Indicador de Filtros */}
      {isFiltered && (
        <div className="mb-4 p-3 bg-cs-blue/10 border border-cs-blue/30 rounded-lg">
          <p className="text-cs-blue text-sm">
            🎯 Clientes filtrados - Mostrando {filteredClients.length} de {allClients.length} clientes
          </p>
        </div>
      )}

      {/* Resumo Geral */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cs-gray-400 text-sm">Total de Clientes</p>
                <p className="text-2xl font-bold text-cs-white">{filteredClients.length}</p>
              </div>
              <Users className="h-8 w-8 text-cs-blue" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cs-dark border-cs-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cs-gray-400 text-sm">Ticket Médio</p>
                <p className="text-2xl font-bold text-cs-white">
                  R${" "}
                  {Math.round(
                    filteredClients.reduce((sum, c) => sum + c.ticketEstimado, 0) / filteredClients.length,
                  ).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-cs-yellow" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cs-dark border-cs-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cs-gray-400 text-sm">Prob. Média</p>
                <p className="text-2xl font-bold text-cs-white">
                  {Math.round(filteredClients.reduce((sum, c) => sum + c.probabilidade, 0) / filteredClients.length)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-cs-blue" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cs-dark border-cs-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cs-gray-400 text-sm">Receita Potencial</p>
                <p className="text-2xl font-bold text-cs-white">
                  R$ {Math.round(filteredClients.reduce((sum, c) => sum + c.ticketEstimado, 0) / 1000)}K
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-cs-yellow" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de Distribuição */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white">Distribuição por Cluster</CardTitle>
            <CardDescription className="text-cs-gray-400">
              Quantidade de clientes por nível de propensão
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Clientes", color: "#0f6de7" },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
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

        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white">Ticket Médio por Cluster</CardTitle>
            <CardDescription className="text-cs-gray-400">Valor médio esperado por nível de propensão</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                avgTicket: { label: "Ticket Médio", color: "#f0bd33" },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clusterStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="cluster" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="avgTicket" radius={[4, 4, 0, 0]}>
                    {clusterStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getClusterColor(entry.cluster).color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Evolução Temporal */}
      <Card className="bg-cs-dark border-cs-gray-700">
        <CardHeader>
          <CardTitle className="text-cs-white">Evolução dos Clusters</CardTitle>
          <CardDescription className="text-cs-gray-400">
            Tendência de distribuição dos clusters ao longo do tempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              "Alta Propensão": { label: "Alta Propensão", color: "#10b981" },
              "Média Propensão": { label: "Média Propensão", color: "#f0bd33" },
              "Baixa Propensão": { label: "Baixa Propensão", color: "#f97316" },
              "Muito Baixa": { label: "Muito Baixa", color: "#ef4444" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData}>
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
                <Line
                  type="monotone"
                  dataKey="Alta Propensão"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Média Propensão"
                  stroke="#f0bd33"
                  strokeWidth={3}
                  dot={{ fill: "#f0bd33", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Baixa Propensão"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Muito Baixa"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Cards de Clusters - Sem nomes individuais */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {clusterStats.map((stat) => {
          const clusterColor = getClusterColor(stat.cluster)
          const ClusterIcon = getClusterIcon(stat.cluster)
          return (
            <Card key={stat.cluster} className="bg-cs-dark border-cs-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ClusterIcon className="h-6 w-6" style={{ color: clusterColor.color }} />
                    <CardTitle className={`text-lg ${clusterColor.text}`}>{stat.cluster}</CardTitle>
                  </div>
                  <Badge className={`${clusterColor.bg} ${clusterColor.text} ${clusterColor.border}`}>
                    {stat.count} clientes
                  </Badge>
                </div>
                <CardDescription className="text-cs-gray-400">
                  Probabilidade média: {stat.avgProbability}% | Ticket médio: R$ {stat.avgTicket.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Métricas do Cluster */}
                <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-cs-gray-800/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-cs-gray-400">Retenção</div>
                    <div className={`text-lg font-bold ${clusterColor.text}`}>{stat.avgRetention}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-cs-gray-400">Receita Total</div>
                    <div className="text-lg font-bold text-cs-yellow">R$ {Math.round(stat.totalRevenue / 1000)}K</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-cs-gray-400">Propensão</div>
                    <div className={`text-lg font-bold ${clusterColor.text}`}>{stat.avgProbability}%</div>
                  </div>
                </div>

                {/* Distribuição por Segmento */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-cs-white">Distribuição por Segmento:</h4>
                  {Object.entries(stat.segmentDistribution).map(([segment, count]) => {
                    const percentage = ((count as number) / stat.count) * 100
                    return (
                      <div key={segment} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-cs-gray-300">{segment}</span>
                          <span className="text-cs-white font-medium">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-cs-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: clusterColor.color,
                              opacity: 0.7,
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Insights do Cluster */}
                <div className={`mt-4 p-3 ${clusterColor.bg} ${clusterColor.border} border rounded-lg`}>
                  <h4 className={`text-sm font-medium ${clusterColor.text} mb-1`}>💡 Insight Principal:</h4>
                  <p className="text-cs-gray-300 text-sm">
                    {stat.cluster === "Alta Propensão" &&
                      "Clientes com maior probabilidade de conversão. Foque em campanhas premium e experiências personalizadas."}
                    {stat.cluster === "Média Propensão" &&
                      "Clientes com potencial de conversão. Ideal para campanhas de nurturing e ofertas direcionadas."}
                    {stat.cluster === "Baixa Propensão" &&
                      "Clientes que precisam de mais estímulos. Considere promoções e campanhas de reativação."}
                    {stat.cluster === "Muito Baixa" &&
                      "Clientes com baixa propensão. Foque em estratégias de retenção e valor agregado."}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
