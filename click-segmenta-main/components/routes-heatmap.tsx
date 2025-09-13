"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, TrendingUp, Users } from "lucide-react"

const routesData = [
  {
    origem: "São Paulo",
    destino: "Rio de Janeiro",
    demanda: 95,
    clientes: 2847,
    ticketMedio: "R$ 2.400",
    crescimento: "+12%",
  },
  {
    origem: "Brasília",
    destino: "Salvador",
    demanda: 87,
    clientes: 1923,
    ticketMedio: "R$ 1.800",
    crescimento: "+8%",
  },
  {
    origem: "Belo Horizonte",
    destino: "Fortaleza",
    demanda: 78,
    clientes: 1456,
    ticketMedio: "R$ 2.100",
    crescimento: "+15%",
  },
  {
    origem: "Porto Alegre",
    destino: "Recife",
    demanda: 72,
    clientes: 1234,
    ticketMedio: "R$ 2.800",
    crescimento: "+5%",
  },
  {
    origem: "Curitiba",
    destino: "Manaus",
    demanda: 68,
    clientes: 987,
    ticketMedio: "R$ 3.200",
    crescimento: "+18%",
  },
  {
    origem: "Goiânia",
    destino: "Belém",
    demanda: 61,
    clientes: 756,
    ticketMedio: "R$ 2.600",
    crescimento: "+7%",
  },
]

const getDemandColor = (demanda: number) => {
  if (demanda >= 90) return "bg-red-500"
  if (demanda >= 80) return "bg-orange-500"
  if (demanda >= 70) return "bg-yellow-500"
  if (demanda >= 60) return "bg-blue-500"
  return "bg-gray-500"
}

const getDemandIntensity = (demanda: number) => {
  if (demanda >= 90) return "opacity-100"
  if (demanda >= 80) return "opacity-80"
  if (demanda >= 70) return "opacity-60"
  if (demanda >= 60) return "opacity-40"
  return "opacity-20"
}

export function RoutesHeatmap() {
  return (
    <div className="space-y-6">
      {/* Mapa Visual Simplificado */}
      <Card className="bg-cs-dark border-cs-gray-700">
        <CardHeader>
          <CardTitle className="text-cs-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-cs-blue" />
            Mapa de Calor - Rotas Principais
          </CardTitle>
          <CardDescription className="text-cs-gray-400">
            Intensidade de demanda por rota (últimos 30 dias)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-cs-gray-900 rounded-lg p-8 min-h-[400px]">
            {/* Representação visual simplificada do Brasil */}
            <div className="relative w-full h-full">
              {/* Pontos das cidades principais */}
              <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-cs-blue rounded-full animate-pulse"></div>
              <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-cs-blue rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-cs-blue rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-cs-blue rounded-full animate-pulse"></div>
              <div className="absolute top-1/5 right-1/3 w-3 h-3 bg-cs-blue rounded-full animate-pulse"></div>
              <div className="absolute top-1/6 left-1/2 w-3 h-3 bg-cs-blue rounded-full animate-pulse"></div>

              {/* Linhas de conexão com intensidade baseada na demanda */}
              <svg className="absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id="routeGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0f6de7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#f0bd33" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="routeGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f0bd33" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#0f6de7" stopOpacity="0.6" />
                  </linearGradient>
                </defs>

                {/* Rotas principais */}
                <line x1="33%" y1="25%" x2="75%" y2="33%" stroke="url(#routeGradient1)" strokeWidth="4" opacity="0.9" />
                <line x1="50%" y1="16%" x2="66%" y2="33%" stroke="url(#routeGradient2)" strokeWidth="3" opacity="0.7" />
                <line x1="25%" y1="50%" x2="66%" y2="33%" stroke="url(#routeGradient1)" strokeWidth="3" opacity="0.6" />
                <line x1="20%" y1="66%" x2="66%" y2="33%" stroke="url(#routeGradient2)" strokeWidth="2" opacity="0.5" />
              </svg>

              {/* Labels das cidades */}
              <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-8">
                <span className="text-xs text-cs-white bg-cs-dark px-2 py-1 rounded">SP</span>
              </div>
              <div className="absolute top-1/3 right-1/4 transform translate-x-1/2 -translate-y-8">
                <span className="text-xs text-cs-white bg-cs-dark px-2 py-1 rounded">RJ</span>
              </div>
              <div className="absolute top-1/5 right-1/3 transform -translate-x-1/2 -translate-y-8">
                <span className="text-xs text-cs-white bg-cs-dark px-2 py-1 rounded">SSA</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Rotas */}
      <Card className="bg-cs-dark border-cs-gray-700">
        <CardHeader>
          <CardTitle className="text-cs-white">Detalhamento por Rota</CardTitle>
          <CardDescription className="text-cs-gray-400">Métricas detalhadas das principais rotas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {routesData.map((route, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-cs-gray-800/50 rounded-lg hover:bg-cs-gray-800 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-4 h-4 rounded-full ${getDemandColor(route.demanda)} ${getDemandIntensity(route.demanda)}`}
                  ></div>
                  <div>
                    <div className="font-medium text-cs-white">
                      {route.origem} → {route.destino}
                    </div>
                    <div className="text-sm text-cs-gray-400">Demanda: {route.demanda}%</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-cs-gray-300">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">Clientes</span>
                    </div>
                    <div className="font-bold text-cs-white">{route.clientes.toLocaleString()}</div>
                  </div>

                  <div className="text-center">
                    <div className="text-sm text-cs-gray-300">Ticket Médio</div>
                    <div className="font-bold text-cs-yellow">{route.ticketMedio}</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center gap-1 text-cs-gray-300">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">Crescimento</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{route.crescimento}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
