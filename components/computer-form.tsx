"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ComputerFormProps {
  computer?: any
  isEdit?: boolean
}

export function ComputerForm({ computer, isEdit = false }: ComputerFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    customer_name: computer?.customer_name || "",
    customer_email: computer?.customer_email || "",
    customer_phone: computer?.customer_phone || "",
    brand: computer?.brand || "",
    model: computer?.model || "",
    serial_number: computer?.serial_number || "",
    issue_description: computer?.issue_description || "",
    status: computer?.status || "pending",
    technician_notes: computer?.technician_notes || "",
    estimated_cost: computer?.estimated_cost || "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Usuario no autenticado")
      }

      const computerData = {
        ...formData,
        estimated_cost: formData.estimated_cost ? Number.parseFloat(formData.estimated_cost) : null,
        owner_id: user.id,
      }

      if (isEdit && computer) {
        const { error } = await supabase.from("computers").update(computerData).eq("id", computer.id)

        if (error) throw error
      } else {
        const { data, error } = await supabase.from("computers").insert([computerData]).select("ticket_number").single()

        if (error) throw error

        if (data?.ticket_number && formData.customer_email) {
          try {
            const emailResponse = await fetch("/api/send-ticket-email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                customerEmail: formData.customer_email,
                customerName: formData.customer_name,
                ticketNumber: data.ticket_number,
                brand: formData.brand,
                model: formData.model,
                issueDescription: formData.issue_description,
              }),
            })

            if (!emailResponse.ok) {
              console.error("[v0] Failed to send email notification")
            }
          } catch (emailError) {
            console.error("[v0] Error sending email:", emailError)
            // Don't throw - we still want to show success even if email fails
          }
        }

        if (data?.ticket_number) {
          alert(
            `Computadora registrada exitosamente!\n\nNúmero de ticket: ${data.ticket_number}\n\nSe ha enviado un email al cliente con los detalles del ticket.`,
          )
        }
      }

      router.push("/dashboard/computers")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al guardar la computadora")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información del Cliente</CardTitle>
          <CardDescription>Datos de contacto del propietario de la computadora</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer_name">Nombre completo *</Label>
            <Input
              id="customer_name"
              placeholder="Juan Pérez"
              required
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="customer_email">Email *</Label>
              <Input
                id="customer_email"
                type="email"
                placeholder="juan@ejemplo.com"
                required
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_phone">Teléfono</Label>
              <Input
                id="customer_phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={formData.customer_phone}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Computadora</CardTitle>
          <CardDescription>Detalles del equipo y problema reportado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="brand">Marca *</Label>
              <Input
                id="brand"
                placeholder="Dell, HP, Lenovo..."
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Modelo *</Label>
              <Input
                id="model"
                placeholder="Inspiron 15, ThinkPad..."
                required
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serial_number">Número de serie</Label>
            <Input
              id="serial_number"
              placeholder="ABC123456789"
              value={formData.serial_number}
              onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue_description">Descripción del problema *</Label>
            <Textarea
              id="issue_description"
              placeholder="Describe el problema que presenta la computadora..."
              required
              rows={4}
              value={formData.issue_description}
              onChange={(e) => setFormData({ ...formData, issue_description: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estado y Diagnóstico</CardTitle>
          <CardDescription>Información técnica y estado de la reparación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="in_progress">En progreso</SelectItem>
                <SelectItem value="needs_repair">Necesita reparación</SelectItem>
                <SelectItem value="completed">Completada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="technician_notes">Notas del técnico</Label>
            <Textarea
              id="technician_notes"
              placeholder="Notas adicionales sobre el diagnóstico o reparación..."
              rows={3}
              value={formData.technician_notes}
              onChange={(e) => setFormData({ ...formData, technician_notes: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated_cost">Costo estimado</Label>
            <Input
              id="estimated_cost"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.estimated_cost}
              onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1 bg-transparent">
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Guardando..." : isEdit ? "Actualizar" : "Agregar"}
        </Button>
      </div>
    </form>
  )
}
