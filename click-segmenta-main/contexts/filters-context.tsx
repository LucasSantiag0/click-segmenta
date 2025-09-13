"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface FilterState {
  origem?: string
  destino?: string
  segmento?: string
  probabilidadeMin: number
  ticketMin: number
  ticketMax: number
  periodo?: string
  retencao?: string
  demanda?: string
  dataInicio?: string
  dataFim?: string
  applied: boolean
}

interface FiltersContextType {
  filters: FilterState
  tempFilters: FilterState
  updateTempFilter: (key: keyof FilterState, value: string | number | boolean) => void
  applyFilters: () => void
  clearFilters: () => void
  activeFilters: string[]
  isFiltered: boolean
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined)

const defaultFilters: FilterState = {
  probabilidadeMin: 70,
  ticketMin: 1000,
  ticketMax: 10000,
  applied: false,
}

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [tempFilters, setTempFilters] = useState<FilterState>(defaultFilters)

  const updateTempFilter = (key: keyof FilterState, value: string | number | boolean) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    setFilters({ ...tempFilters, applied: true })
  }

  const clearFilters = () => {
    const clearedFilters = { ...defaultFilters, applied: true }
    setFilters(clearedFilters)
    setTempFilters(clearedFilters)
  }

  const activeFilters = Object.entries(filters)
    .filter(([key, value]) => {
      if (key === "applied") return false
      if (key === "probabilidadeMin" && value === 70) return false
      if (key === "ticketMin" && value === 1000) return false
      if (key === "ticketMax" && value === 10000) return false
      return value !== undefined && value !== ""
    })
    .map(([key, value]) => {
      switch (key) {
        case "origem":
          return `Origem: ${value}`
        case "destino":
          return `Destino: ${value}`
        case "segmento":
          return `Segmento: ${value}`
        case "probabilidadeMin":
          return `Probabilidade: ≥${value}%`
        case "ticketMin":
          return `Ticket Min: ≥R$ ${(value as number).toLocaleString()}`
        case "ticketMax":
          return `Ticket Max: ≤R$ ${(value as number).toLocaleString()}`
        case "periodo":
          return `Período: ${value}`
        case "retencao":
          return `Retenção: ${value}`
        case "demanda":
          return `Demanda: ${value}`
        case "dataInicio":
          return `Data Início: ${value}`
        case "dataFim":
          return `Data Fim: ${value}`
        default:
          return `${key}: ${value}`
      }
    })

  const isFiltered = activeFilters.length > 0

  return (
    <FiltersContext.Provider
      value={{
        filters,
        tempFilters,
        updateTempFilter,
        applyFilters,
        clearFilters,
        activeFilters,
        isFiltered,
      }}
    >
      {children}
    </FiltersContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FiltersContext)
  if (context === undefined) {
    throw new Error("useFilters must be used within a FiltersProvider")
  }
  return context
}
