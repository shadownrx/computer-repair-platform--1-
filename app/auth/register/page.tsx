"use client"

import type React from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Wrench, AlertCircle, CheckCircle2 } from "lucide-react"
import { registerSchema, type RegisterInput } from "@/lib/schemas"
import { toast } from "sonner"

export default function RegisterPage() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")
  const router = useRouter()

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: RegisterInput) => {
    const supabase = createClient()
    try {
      const redirectUrl = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`

      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: data.fullName,
            phone: data.phone,
          },
        },
      })

      if (error) throw error

      if (signUpData.user && !signUpData.user.confirmed_at) {
        setRegisteredEmail(data.email)
        setShowSuccess(true)
        toast.success("Cuenta creada", {
          description: "Revisa tu correo para confirmar tu cuenta.",
        })
      } else if (signUpData.user && signUpData.user.confirmed_at) {
        toast.success("Cuenta creada", {
          description: "Tu cuenta ha sido creada exitosamente.",
        })
        router.push("/dashboard")
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al registrarse"
      toast.error("Error al registrarse", {
        description: errorMessage,
      })
    }
  }

  if (showSuccess) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:from-slate-950 dark:to-slate-900">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600" role="img" aria-label="RepairTech Logo">
              <Wrench className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">RepairTech</h1>
            <p className="text-slate-600 dark:text-slate-400">Gestión de reparaciones</p>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" aria-hidden="true" />
              </div>
              <CardTitle className="text-2xl">¡Cuenta Creada!</CardTitle>
              <CardDescription>Revisa tu correo para confirmar tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                <AlertTitle>Verifica tu correo electrónico</AlertTitle>
                <AlertDescription>
                  Hemos enviado un correo de confirmación a <strong>{registeredEmail}</strong>. Haz clic en el enlace del correo
                  para activar tu cuenta.
                </AlertDescription>
              </Alert>

              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <p className="font-medium">¿No recibiste el correo?</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Revisa tu carpeta de spam o correo no deseado</li>
                  <li>Verifica que el correo electrónico sea correcto</li>
                  <li>El correo puede tardar unos minutos en llegar</li>
                </ul>
              </div>

              <div className="pt-4">
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/auth/login">Volver al inicio de sesión</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600" role="img" aria-label="RepairTech Logo">
            <Wrench className="h-8 w-8 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">RepairTech</h1>
          <p className="text-slate-600 dark:text-slate-400">Gestión de reparaciones</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
            <CardDescription>Completa el formulario para registrarte</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="fullName">Nombre completo</FormLabel>
                        <FormControl>
                          <Input id="fullName" type="text" placeholder="Juan Pérez" {...field} aria-required="true" autoComplete="name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email">Correo electrónico</FormLabel>
                        <FormControl>
                          <Input id="email" type="email" placeholder="tu@email.com" {...field} aria-required="true" autoComplete="email" />
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
                        <FormLabel htmlFor="phone">Teléfono (opcional)</FormLabel>
                        <FormControl>
                          <Input id="phone" type="tel" placeholder="+1234567890" {...field} autoComplete="tel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="password">Contraseña</FormLabel>
                        <FormControl>
                          <Input id="password" type="password" {...field} aria-required="true" autoComplete="new-password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="confirmPassword">Confirmar contraseña</FormLabel>
                        <FormControl>
                          <Input id="confirmPassword" type="password" {...field} aria-required="true" autoComplete="new-password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Creando cuenta..." : "Registrarse"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  ¿Ya tienes cuenta?{" "}
                  <Link href="/auth/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                    Inicia sesión
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
