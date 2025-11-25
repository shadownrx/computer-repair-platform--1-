"use client"

import type React from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { ComputerStatusCard } from "@/components/computer-status-card"
import { trackTicketSchema, type TrackTicketInput } from "@/lib/schemas"
import { toast } from "sonner"
import type { Computer } from "@/types/computer"

export function TrackTicketForm() {
  const [computer, setComputer] = useState<Computer | null>(null)
  const supabase = createClient()

  const form = useForm<TrackTicketInput>({
    resolver: zodResolver(trackTicketSchema),
    defaultValues: {
      ticket_number: "",
    },
  })

  const onSubmit = async (data: TrackTicketInput) => {
    try {
      const { data: foundComputer, error } = await supabase
        .from("computers")
        .select("*")
        .eq("ticket_number", data.ticket_number.trim().toUpperCase())
        .single()

      if (error || !foundComputer) {
        toast.error("Ticket no encontrado", {
          description: "No se encontró ninguna computadora con ese número de ticket. Verifica el número e intenta de nuevo.",
        })
        setComputer(null)
        return
      }

      setComputer(foundComputer as Computer)
      toast.success("Ticket encontrado", {
        description: "La información de tu reparación se muestra a continuación.",
      })
    } catch (err) {
      toast.error("Error al buscar el ticket", {
        description: "Por favor intenta de nuevo más tarde.",
      })
      setComputer(null)
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="ticket_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="ticket">Número de Ticket</FormLabel>
                <FormControl>
                  <Input
                    id="ticket"
                    placeholder="RT-20250102-1234"
                    className="font-mono uppercase"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    aria-required="true"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
            <Search className="mr-2 h-4 w-4" aria-hidden="true" />
            {form.formState.isSubmitting ? "Buscando..." : "Buscar"}
          </Button>
        </form>
      </Form>

      {computer && <ComputerStatusCard computer={computer} />}
    </div>
  )
}
