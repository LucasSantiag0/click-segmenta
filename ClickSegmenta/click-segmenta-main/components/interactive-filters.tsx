"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Filter, X, Calendar, DollarSign, Users, MapPin, RefreshCw } from "lucide-react"
import { useFilters } from "@/contexts/filters-context"

const cidades = [
  "São Paulo",
  "Rio de Janeiro",
  "Brasília",
  "Salvador",
  "Belo Horizonte",
  "Fortaleza",
  "Porto Alegre",
  "Recife",
  "Curitiba",
  "Manaus",
  "Belém",
  "Goiânia",
]

export function InteractiveFilters() {
  const { filters, tempFilters, updateTempFilter, applyFilters, clearFilters, activeFilters, isFiltered } = useFilters()

  const removeFilter = (filterText: string) => {
    if (filterText.includes("Origem:")) {
      updateTempFilter("origem", "")
    } else if (filterText.includes("Destino:")) {
      updateTempFilter("destino", "")
    } else if (filterText.includes("Segmento:")) {
      updateTempFilter("segmento", "")
    } else if (filterText.includes("Probabilidade:")) {
      updateTempFilter("probabilidadeMin", 70)
    } else if (filterText.includes("Ticket Min:")) {
      updateTempFilter("ticketMin", 1000)
    } else if (filterText.includes("Ticket Max:")) {
      updateTempFilter("ticketMax", 10000)
    } else if (filterText.includes("Período:")) {
      updateTempFilter("periodo", "")
    } else if (filterText.includes("Retenção:")) {
      updateTempFilter("retencao", "")
    } else if (filterText.includes("Demanda:")) {
      updateTempFilter("demanda", "")
    } else if (filterText.includes("Data Início:")) {
      updateTempFilter("dataInicio", "")
    } else if (filterText.includes("Data Fim:")) {
      updateTempFilter("dataFim", "")
    }
    applyFilters()
  }

  const hasChanges = JSON.stringify(filters) !== JSON.stringify(tempFilters)

  return (
    <div className="space-y-6">
      {/* Status dos Filtros */}
      <Card className="bg-cs-dark border-cs-gray-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-cs-white text-lg flex items-center gap-2">
              <Filter className="h-5 w-5 text-cs-blue" />
              Status dos Filtros
            </CardTitle>
            <div className="flex gap-2">
              {hasChanges && (
                <Button onClick={applyFilters} className="cs-button-primary" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Aplicar Filtros
                </Button>
              )}
              {isFiltered && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="border-cs-gray-600 text-cs-gray-300 hover:bg-cs-gray-700"
                >
                  Limpar Todos
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeFilters.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <Badge key={filter} className="bg-cs-blue/20 text-cs-blue border-cs-blue/30 flex items-center gap-1">
                  {filter}
                  <X className="h-3 w-3 cursor-pointer hover:text-cs-white" onClick={() => removeFilter(filter)} />
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-cs-gray-400 text-sm">Nenhum filtro aplicado - Mostrando todos os dados</p>
          )}
          {hasChanges && (
            <div className="mt-2 p-2 bg-cs-yellow/10 border border-cs-yellow/30 rounded text-cs-yellow text-sm">
              ⚠️ Você tem alterações não aplicadas. Clique em "Aplicar Filtros" para atualizar o dashboard.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Filtros Geográficos */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-cs-yellow" />
              Filtros de Rota
            </CardTitle>
            <CardDescription className="text-cs-gray-400">
              Selecione origem e destino para análise específica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-cs-gray-300 mb-2 block">Cidade de Origem</label>
              <Select
                value={tempFilters.origem || ""}
                onValueChange={(value) => updateTempFilter("origem", value === "all" ? "" : value)}
              >
                <SelectTrigger className="bg-cs-gray-800 border-cs-gray-600 text-cs-white">
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
                <SelectContent className="bg-cs-gray-800 border-cs-gray-600">
                  <SelectItem value="all">Todas as cidades</SelectItem>
                  {cidades.map((cidade) => (
                    <SelectItem key={cidade} value={cidade}>
                      {cidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-cs-gray-300 mb-2 block">Cidade de Destino</label>
              <Select
                value={tempFilters.destino || ""}
                onValueChange={(value) => updateTempFilter("destino", value === "all" ? "" : value)}
              >
                <SelectTrigger className="bg-cs-gray-800 border-cs-gray-600 text-cs-white">
                  <SelectValue placeholder="Selecione o destino" />
                </SelectTrigger>
                <SelectContent className="bg-cs-gray-800 border-cs-gray-600">
                  <SelectItem value="all">Todas as cidades</SelectItem>
                  {cidades.map((cidade) => (
                    <SelectItem key={cidade} value={cidade}>
                      {cidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Filtros de Segmentação */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <Users className="h-5 w-5 text-cs-blue" />
              Filtros de Segmentação
            </CardTitle>
            <CardDescription className="text-cs-gray-400">
              Filtre clientes por características demográficas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-cs-gray-300 mb-2 block">Segmento de Cliente</label>
              <Select
                value={tempFilters.segmento || ""}
                onValueChange={(value) => updateTempFilter("segmento", value === "all" ? "" : value)}
              >
                <SelectTrigger className="bg-cs-gray-800 border-cs-gray-600 text-cs-white">
                  <SelectValue placeholder="Selecione um segmento" />
                </SelectTrigger>
                <SelectContent className="bg-cs-gray-800 border-cs-gray-600">
                  <SelectItem value="all">Todos os segmentos</SelectItem>
                  <SelectItem value="planejadores">Planejadores</SelectItem>
                  <SelectItem value="espontaneos">Espontâneos</SelectItem>
                  <SelectItem value="economicos">Econômicos</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-cs-gray-300 mb-3 block">
                Probabilidade de Compra: {tempFilters.probabilidadeMin}%
              </label>
              <Slider
                value={[tempFilters.probabilidadeMin]}
                onValueChange={(value) => updateTempFilter("probabilidadeMin", value[0])}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-cs-gray-400 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-cs-gray-300 mb-2 block">Faixa de Retenção</label>
              <Select
                value={tempFilters.retencao || ""}
                onValueChange={(value) => updateTempFilter("retencao", value === "none" ? "" : value)}
              >
                <SelectTrigger className="bg-cs-gray-800 border-cs-gray-600 text-cs-white">
                  <SelectValue placeholder="Selecione uma faixa" />
                </SelectTrigger>
                <SelectContent className="bg-cs-gray-800 border-cs-gray-600">
                  <SelectItem value="none">Todas as faixas</SelectItem>
                  <SelectItem value="alta">Alta (≥90%)</SelectItem>
                  <SelectItem value="media">Média (70-89%)</SelectItem>
                  <SelectItem value="baixa">Baixa (&lt;70%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Filtros Financeiros */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-cs-yellow" />
              Filtros Financeiros
            </CardTitle>
            <CardDescription className="text-cs-gray-400">Filtre por valores e métricas financeiras</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-cs-gray-300 mb-3 block">
                Ticket Mínimo: R$ {tempFilters.ticketMin.toLocaleString()}
              </label>
              <Slider
                value={[tempFilters.ticketMin]}
                onValueChange={(value) => updateTempFilter("ticketMin", value[0])}
                max={5000}
                min={500}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-cs-gray-400 mt-1">
                <span>R$ 500</span>
                <span>R$ 5.000</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-cs-gray-300 mb-3 block">
                Ticket Máximo: R$ {tempFilters.ticketMax.toLocaleString()}
              </label>
              <Slider
                value={[tempFilters.ticketMax]}
                onValueChange={(value) => updateTempFilter("ticketMax", value[0])}
                max={10000}
                min={1000}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-cs-gray-400 mt-1">
                <span>R$ 1.000</span>
                <span>R$ 10.000</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtros Temporais */}
        <Card className="bg-cs-dark border-cs-gray-700">
          <CardHeader>
            <CardTitle className="text-cs-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cs-blue" />
              Filtros Temporais
            </CardTitle>
            <CardDescription className="text-cs-gray-400">Filtre por períodos e datas específicas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-cs-gray-300 mb-2 block">Previsão para</label>
              <Select
                value={tempFilters.periodo || ""}
                onValueChange={(value) => updateTempFilter("periodo", value === "all" ? "" : value)}
              >
                <SelectTrigger className="bg-cs-gray-800 border-cs-gray-600 text-cs-white">
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent className="bg-cs-gray-800 border-cs-gray-600">
                  <SelectItem value="all">Todos os períodos</SelectItem>
                  <SelectItem value="7dias">Próximos 7 dias</SelectItem>
                  <SelectItem value="15dias">Próximos 15 dias</SelectItem>
                  <SelectItem value="30dias">Próximos 30 dias</SelectItem>
                  <SelectItem value="90dias">Próximos 90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-cs-gray-300 mb-2 block">Data Início</label>
                <Input
                  type="date"
                  value={tempFilters.dataInicio || ""}
                  onChange={(e) => updateTempFilter("dataInicio", e.target.value)}
                  className="bg-cs-gray-800 border-cs-gray-600 text-cs-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-cs-gray-300 mb-2 block">Data Fim</label>
                <Input
                  type="date"
                  value={tempFilters.dataFim || ""}
                  onChange={(e) => updateTempFilter("dataFim", e.target.value)}
                  className="bg-cs-gray-800 border-cs-gray-600 text-cs-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-4 justify-center">
        <Button onClick={applyFilters} className="cs-button-primary" disabled={!hasChanges}>
          <Filter className="h-4 w-4 mr-2" />
          Aplicar Filtros
        </Button>
        <Button
          variant="outline"
          onClick={clearFilters}
          className="border-cs-gray-600 text-cs-gray-300 hover:bg-cs-gray-700"
          disabled={!isFiltered}
        >
          Limpar Todos
        </Button>
      </div>
    </div>
  )
}
