"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProfileFormProps {
  profile: any
  userEmail: string
}

export function ProfileForm({ profile, userEmail }: ProfileFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Usuario no autenticado")
      }

      const { error } = await supabase.from("profiles").update(formData).eq("id", user.id)

      if (error) throw error

      setSuccess(true)
      router.refresh()

      setTimeout(() => setSuccess(false), 3000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al actualizar el perfil")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input id="email" type="email" value={userEmail} disabled className="bg-slate-50" />
        <p className="text-xs text-slate-500">El correo electrónico no se puede cambiar</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Nombre completo *</Label>
        <Input
          id="full_name"
          type="text"
          placeholder="Juan Pérez"
          required
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1234567890"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      {success && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">Perfil actualizado correctamente</div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  )
}
