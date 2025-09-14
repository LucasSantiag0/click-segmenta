"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts"
import { Calendar, Users, TrendingUp, MapPin, Clock } from "lucide-react"
import { useFilters } from "@/contexts/filters-context"

// Dados simulados baseados nos filtros
const getRouteData = (origem?: string, destino?: string) => {
  const baseData = [
    { rota: "São Paulo → Rio de Janeiro", demanda: 95, clientes: 2847, ticketMedio: 2400 },
    { rota: "Brasília → Salvador", demanda: 87, clientes: 1923, ticketMedio: 1800 },
    { rota: "Belo Horizonte → Fortaleza", demanda: 78, clientes: 1456, ticketMedio: 2100 },
    { rota: "Porto Alegre → Recife", demanda: 72, clientes: 1234, ticketMedio: 2800 },
    { rota: "Curitiba → Manaus", demanda: 68, clientes: 987, ticketMedio: 3200 },
  ]

  if (origem && destino) {
    return baseData.filter(
      (item) =>
        item.rota.toLowerCase().includes(origem.toLowerCase()) &&
        item.rota.toLowerCase().includes(destino.toLowerCase()),
    )
  }
  if (origem) {
    return baseData.filter((item) => item.rota.toLowerCase().includes(origem.toLowerCase()))
  }
  if (destino) {
    return baseData.filter((item) => item.rota.toLowerCase().includes(destino.toLowerCase()))
  }

  return baseData
}

const dateAnalysisData = [
  { dia: "Segunda", probabilidade: 78, compras: 245 },
  { dia: "Terça", probabilidade: 82, compras: 289 },
  { dia: "Quarta", probabilidade: 85, compras: 312 },
  { dia: "Quinta", probabilidade: 88, compras: 356 },
  { dia: "Sexta", probabilidade: 92, compras: 423 },
  { dia: "Sábado", probabilidade: 76, compras: 198 },
  { dia: "Domingo", probabilidade: 71, compras: 167 },
]

const clusterAnalysisData = [
  { cluster: "Planejadores", propensao: 94, participacao: 35, ticketMedio: 3200, cor: "#0f6de7" },
  { cluster: "Espontâneos", propensao: 87, participacao: 28, ticketMedio: 1800, cor: "#f0bd33" },
  { cluster: "Premium", propensao: 96, participacao: 15, ticketMedio: 5400, cor: "#8b5cf6" },
  { cluster: "Econômicos", propensao: 73, participacao: 22, ticketMedio: 1200, cor: "#10b981" },
]

export function RoutesAnalysis() {
  const { filters } = useFilters()
  const routeData = getRouteData(filters.origem, filters.destino)

  // Filtrar dados de cluster baseado no filtro de segmento
  const filteredClusterData = filters.segmento
    ? clusterAnalysisData.filter((item) => item.cluster.toLowerCase().includes(filters.segmento!.toLowerCase()))
    : clusterAnalysisData

  return (
    <div className="space-y-6">
      {/* Resumo da Rota Selecionada */}
      {(filters.origem || filters.destino) && (
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-cs-blue" />
              Análise da Rota: {filters.origem || "Qualquer"} → {filters.destino || "Qualquer"}
            </CardTitle>
            <CardDescription className="text-cs-gray-400">Dados específicos para a rota selecionada</CardDescription>
          </CardHeader>
          <CardContent>
            {routeData.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-3">
                {routeData.map((route, index) => (
                  <div key={index} className="bg-cs-gray-800/50 p-4 rounded-lg">
                    <h4 className="font-medium text-cs-white mb-2">{route.rota}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-cs-gray-400">Demanda:</span>
                        <span className="text-cs-yellow font-bold">{route.demanda}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cs-gray-400">Clientes:</span>
                        <span className="text-cs-white">{route.clientes.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cs-gray-400">Ticket Médio:</span>
                        <span className="text-cs-blue font-bold">R$ {route.ticketMedio.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-cs-gray-400">Nenhuma rota encontrada para os filtros selecionados</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Análise por Dia da Semana */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cs-blue" />
              Propensão por Dia da Semana
            </CardTitle>
            <CardDescription className="text-cs-gray-400">Dias com maior probabilidade de compra</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                probabilidade: { label: "Probabilidade (%)", color: "#0f6de7" },
                compras: { label: "Compras", color: "#f0bd33" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dateAnalysisData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="probabilidade" fill="#0f6de7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Análise por Horário */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-cs-yellow" />
              Tendência por Horário
            </CardTitle>
            <CardDescription className="text-cs-gray-400">Horários de pico para compras</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                compras: { label: "Compras", color: "#f0bd33" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { hora: "06h", compras: 12 },
                    { hora: "09h", compras: 45 },
                    { hora: "12h", compras: 78 },
                    { hora: "15h", compras: 92 },
                    { hora: "18h", compras: 156 },
                    { hora: "21h", compras: 134 },
                    { hora: "00h", compras: 23 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hora" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
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
                    dataKey="compras"
                    stroke="#f0bd33"
                    strokeWidth={3}
                    dot={{ fill: "#f0bd33", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Análise por Clusters */}
      <Card className="bg-cs-dark border-cs-gray-700">
        <CardHeader>
          <CardTitle className="text-cs-white flex items-center gap-2">
            <Users className="h-5 w-5 text-cs-blue" />
            Propensão por Cluster de Clientes
          </CardTitle>
          <CardDescription className="text-cs-gray-400">
            Análise detalhada dos clusters mais propensos a comprar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {filteredClusterData.map((cluster) => (
              <div
                key={cluster.cluster}
                className="bg-cs-gray-800/50 p-4 rounded-lg border-l-4 hover:bg-cs-gray-800 transition-colors"
                style={{ borderLeftColor: cluster.cor }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-cs-white">{cluster.cluster}</h4>
                  <Badge
                    className="text-xs"
                    style={{
                      backgroundColor: `${cluster.cor}20`,
                      color: cluster.cor,
                      borderColor: `${cluster.cor}50`,
                    }}
                  >
                    {cluster.participacao}%
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-cs-gray-400">Propensão</span>
                      <span className="text-lg font-bold" style={{ color: cluster.cor }}>
                        {cluster.propensao}%
                      </span>
                    </div>
                    <div className="w-full bg-cs-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${cluster.propensao}%`,
                          backgroundColor: cluster.cor,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-cs-gray-400">Ticket Médio</span>
                    <span className="font-bold text-cs-yellow">R$ {cluster.ticketMedio.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights e Recomendações */}
      <Card className="bg-cs-dark border-cs-gray-700">
        <CardHeader>
          <CardTitle className="text-cs-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cs-yellow" />
            Insights e Recomendações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-cs-blue/10 border border-cs-blue/30 p-4 rounded-lg">
              <h4 className="font-medium text-cs-blue mb-2">💡 Melhor Dia para Campanhas</h4>
              <p className="text-cs-gray-300 text-sm">
                Sexta-feira apresenta 92% de probabilidade de compra. Ideal para lançar promoções e campanhas
                direcionadas.
              </p>
            </div>

            <div className="bg-cs-yellow/10 border border-cs-yellow/30 p-4 rounded-lg">
              <h4 className="font-medium text-cs-yellow mb-2">🎯 Cluster Premium</h4>
              <p className="text-cs-gray-300 text-sm">
                Clientes Premium têm 96% de propensão com ticket médio de R$ 5.400. Foque em experiências exclusivas.
              </p>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
              <h4 className="font-medium text-green-400 mb-2">📈 Horário de Pico</h4>
              <p className="text-cs-gray-300 text-sm">
                18h é o horário com maior volume de compras (156 transações). Otimize a disponibilidade do sistema.
              </p>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg">
              <h4 className="font-medium text-purple-400 mb-2">🔄 Oportunidade</h4>
              <p className="text-cs-gray-300 text-sm">
                Cluster Econômicos tem menor propensão (73%). Considere estratégias de preço e promoções.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
