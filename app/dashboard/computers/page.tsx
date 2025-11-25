"use client"

import { useState, useMemo, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Laptop } from "lucide-react"
import Link from "next/link"
import { ComputerCard } from "@/components/computer-card"
import { ComputerFilters } from "@/components/computer-filters"
import type { Computer } from "@/types/computer"

export default function ComputersPage() {
  const [computers, setComputers] = useState<Computer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    async function fetchComputers() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setIsLoading(false)
        return
      }

      const { data } = await supabase
        .from("computers")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false })

      setComputers((data || []) as Computer[])
      setIsLoading(false)
    }

    fetchComputers()
  }, [])

  const filteredAndSortedComputers = useMemo(() => {
    let filtered = [...computers]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (computer) =>
          computer.brand.toLowerCase().includes(query) ||
          computer.model.toLowerCase().includes(query) ||
          computer.ticket_number?.toLowerCase().includes(query) ||
          computer.customer_name.toLowerCase().includes(query) ||
          computer.issue_description.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((computer) => computer.status === statusFilter)
    }

    // Apply sorting
    switch (sortBy) {
      case "oldest":
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case "brand":
        filtered.sort((a, b) => a.brand.localeCompare(b.brand))
        break
      case "status":
        filtered.sort((a, b) => a.status.localeCompare(b.status))
        break
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
    }

    return filtered
  }, [computers, searchQuery, statusFilter, sortBy])

  const handleClearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setSortBy("newest")
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Mis Computadoras</h1>
            <p className="text-slate-600">Gestiona todas tus computadoras en reparación</p>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mis Computadoras</h1>
          <p className="text-slate-600">Gestiona todas tus computadoras en reparación</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/computers/new">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Agregar computadora
          </Link>
        </Button>
      </div>

      {computers.length > 0 && (
        <ComputerFilters
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          sortBy={sortBy}
          onSearchChange={setSearchQuery}
          onStatusFilterChange={setStatusFilter}
          onSortChange={setSortBy}
          onClear={handleClearFilters}
        />
      )}

      {filteredAndSortedComputers.length > 0 ? (
        <>
          <div className="text-sm text-slate-600">
            Mostrando {filteredAndSortedComputers.length} de {computers.length} computadora{computers.length !== 1 ? "s" : ""}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedComputers.map((computer) => (
              <ComputerCard key={computer.id} computer={computer} />
            ))}
          </div>
        </>
      ) : computers.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Laptop className="mx-auto h-16 w-16 text-slate-300" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-medium text-slate-900">No hay computadoras registradas</h3>
              <p className="mt-2 text-sm text-slate-500">
                Comienza agregando tu primera computadora para darle seguimiento
              </p>
              <Button asChild className="mt-6">
                <Link href="/dashboard/computers/new">
                  <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                  Agregar computadora
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Laptop className="mx-auto h-16 w-16 text-slate-300" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-medium text-slate-900">No se encontraron resultados</h3>
              <p className="mt-2 text-sm text-slate-500">
                Intenta ajustar los filtros de búsqueda para encontrar lo que buscas
              </p>
              <Button variant="outline" onClick={handleClearFilters} className="mt-6">
                Limpiar filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
