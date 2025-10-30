"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { ComputerStatusCard } from "@/components/computer-status-card"

export function TrackTicketForm() {
  const [ticketNumber, setTicketNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [computer, setComputer] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setComputer(null)

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("computers")
        .select("*")
        .eq("ticket_number", ticketNumber.trim().toUpperCase())
        .single()

      if (error || !data) {
        setError("No se encontró ninguna computadora con ese número de ticket")
        return
      }

      setComputer(data)
    } catch (err) {
      setError("Error al buscar el ticket. Por favor intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ticket">Número de Ticket</Label>
          <Input
            id="ticket"
            placeholder="RT-20250102-1234"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            required
            className="font-mono uppercase"
          />
        </div>

        {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <Button type="submit" disabled={isLoading} className="w-full">
          <Search className="mr-2 h-4 w-4" />
          {isLoading ? "Buscando..." : "Buscar"}
        </Button>
      </form>

      {computer && <ComputerStatusCard computer={computer} />}
    </div>
  )
}
