"use client"

import type React from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { profileFormSchema, type ProfileFormInput } from "@/lib/schemas"
import { toast } from "sonner"
import type { Profile } from "@/types/profile"

interface ProfileFormProps {
  profile: Profile | null
  userEmail: string
}

export function ProfileForm({ profile, userEmail }: ProfileFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const form = useForm<ProfileFormInput>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
    },
  })

  const onSubmit = async (data: ProfileFormInput) => {
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

      const { error } = await supabase.from("profiles").update(data).eq("id", user.id)

      if (error) throw error

      toast.success("Perfil actualizado", {
        description: "Los cambios se han guardado correctamente.",
      })

      router.refresh()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al actualizar el perfil"
      toast.error("Error", {
        description: errorMessage,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input id="email" type="email" value={userEmail} disabled className="bg-slate-50" aria-label="Correo electrónico (no editable)" />
          <p className="text-xs text-slate-500">El correo electrónico no se puede cambiar</p>
        </div>

        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="full_name">Nombre completo *</FormLabel>
              <FormControl>
                <Input id="full_name" type="text" placeholder="Juan Pérez" {...field} aria-required="true" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="phone">Teléfono</FormLabel>
              <FormControl>
                <Input id="phone" type="tel" placeholder="+1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>
    </Form>
  )
}
