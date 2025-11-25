"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ComputerStatus } from "@/types/computer"

interface ComputerFiltersProps {
  searchQuery: string
  statusFilter: string
  sortBy: string
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
  onSortChange: (value: string) => void
  onClear: () => void
}

export function ComputerFilters({
  searchQuery,
  statusFilter,
  sortBy,
  onSearchChange,
  onStatusFilterChange,
  onSortChange,
  onClear,
}: ComputerFiltersProps) {
  const hasActiveFilters = searchQuery || statusFilter !== "all" || sortBy !== "newest"

  return (
    <div className="space-y-4 rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Filtros y búsqueda</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear} className="h-8 text-xs">
            <X className="mr-1 h-3 w-3" aria-hidden="true" />
            Limpiar
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <Input
              id="search"
              type="text"
              placeholder="Marca, modelo, ticket..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
              aria-label="Buscar computadoras"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status-filter">Estado</Label>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger id="status-filter" aria-label="Filtrar por estado">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="in_progress">En progreso</SelectItem>
              <SelectItem value="needs_repair">Necesita reparación</SelectItem>
              <SelectItem value="completed">Completada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort">Ordenar por</Label>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger id="sort" aria-label="Ordenar computadoras">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Más recientes</SelectItem>
              <SelectItem value="oldest">Más antiguas</SelectItem>
              <SelectItem value="brand">Marca (A-Z)</SelectItem>
              <SelectItem value="status">Estado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

