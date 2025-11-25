"use client"

import type React from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { computerFormSchema, type ComputerFormInput } from "@/lib/schemas"
import { toast } from "sonner"
import type { Computer } from "@/types/computer"

interface ComputerFormProps {
  computer?: Computer
  isEdit?: boolean
}

export function ComputerForm({ computer, isEdit = false }: ComputerFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const form = useForm<ComputerFormInput>({
    resolver: zodResolver(computerFormSchema),
    defaultValues: {
      customer_name: computer?.customer_name || "",
      customer_email: computer?.customer_email || "",
      customer_phone: computer?.customer_phone || "",
      brand: computer?.brand || "",
      model: computer?.model || "",
      serial_number: computer?.serial_number || "",
      issue_description: computer?.issue_description || "",
      status: computer?.status || "pending",
      technician_notes: computer?.technician_notes || "",
      estimated_cost: computer?.estimated_cost?.toString() || "",
    },
  })

  const onSubmit = async (data: ComputerFormInput) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("Error de autenticación", {
          description: "Usuario no autenticado. Por favor inicia sesión.",
        })
        return
      }

      const computerData = {
        ...data,
        estimated_cost: data.estimated_cost ? Number.parseFloat(data.estimated_cost) : null,
        owner_id: user.id,
      }

      if (isEdit && computer) {
        const { error } = await supabase.from("computers").update(computerData).eq("id", computer.id)

        if (error) throw error

        toast.success("Computadora actualizada", {
          description: "Los cambios se han guardado correctamente.",
        })
      } else {
        const { data: newComputer, error } = await supabase
          .from("computers")
          .insert([computerData])
          .select("ticket_number")
          .single()

        if (error) throw error

        if (newComputer?.ticket_number && data.customer_email) {
          try {
            const emailResponse = await fetch("/api/send-ticket-email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                customerEmail: data.customer_email,
                customerName: data.customer_name,
                ticketNumber: newComputer.ticket_number,
                brand: data.brand,
                model: data.model,
                issueDescription: data.issue_description,
              }),
            })

            if (!emailResponse.ok) {
              console.error("Failed to send email notification")
            }
          } catch (emailError) {
            console.error("Error sending email:", emailError)
            // Don't throw - we still want to show success even if email fails
          }
        }

        if (newComputer?.ticket_number) {
          toast.success("Computadora registrada exitosamente", {
            description: `Número de ticket: ${newComputer.ticket_number}. Se ha enviado un email al cliente con los detalles.`,
            duration: 5000,
          })
        }
      }

      router.push("/dashboard/computers")
      router.refresh()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al guardar la computadora"
      toast.error("Error", {
        description: errorMessage,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
            <CardDescription>Datos de contacto del propietario de la computadora</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="customer_name">Nombre completo *</FormLabel>
                  <FormControl>
                    <Input id="customer_name" placeholder="Juan Pérez" {...field} aria-required="true" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="customer_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="customer_email">Email *</FormLabel>
                    <FormControl>
                      <Input
                        id="customer_email"
                        type="email"
                        placeholder="juan@ejemplo.com"
                        {...field}
                        aria-required="true"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customer_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="customer_phone">Teléfono</FormLabel>
                    <FormControl>
                      <Input id="customer_phone" type="tel" placeholder="+1 234 567 8900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="brand">Marca *</FormLabel>
                    <FormControl>
                      <Input id="brand" placeholder="Dell, HP, Lenovo..." {...field} aria-required="true" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="model">Modelo *</FormLabel>
                    <FormControl>
                      <Input id="model" placeholder="Inspiron 15, ThinkPad..." {...field} aria-required="true" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="serial_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="serial_number">Número de serie</FormLabel>
                  <FormControl>
                    <Input id="serial_number" placeholder="ABC123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issue_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="issue_description">Descripción del problema *</FormLabel>
                  <FormControl>
                    <Textarea
                      id="issue_description"
                      placeholder="Describe el problema que presenta la computadora..."
                      rows={4}
                      {...field}
                      aria-required="true"
                    />
                  </FormControl>
                  <FormDescription>Mínimo 10 caracteres</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado y Diagnóstico</CardTitle>
            <CardDescription>Información técnica y estado de la reparación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="status">Estado</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="in_progress">En progreso</SelectItem>
                      <SelectItem value="needs_repair">Necesita reparación</SelectItem>
                      <SelectItem value="completed">Completada</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="technician_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="technician_notes">Notas del técnico</FormLabel>
                  <FormControl>
                    <Textarea
                      id="technician_notes"
                      placeholder="Notas adicionales sobre el diagnóstico o reparación..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimated_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="estimated_cost">Costo estimado</FormLabel>
                  <FormControl>
                    <Input
                      id="estimated_cost"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormDescription>Ingresa el costo estimado en formato decimal (ej: 150.50)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1 bg-transparent">
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting} className="flex-1">
            {form.formState.isSubmitting ? "Guardando..." : isEdit ? "Actualizar" : "Agregar"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
