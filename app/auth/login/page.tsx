"use client"

import type React from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Wrench, AlertCircle, Mail } from "lucide-react"
import { loginSchema, type LoginInput } from "@/lib/schemas"
import { toast } from "sonner"

export default function LoginPage() {
  const [isResending, setIsResending] = useState(false)
  const [showEmailNotConfirmed, setShowEmailNotConfirmed] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      toast.error("Error de autenticación", {
        description: decodeURIComponent(errorParam),
      })
    }
  }, [searchParams])

  const handleResendConfirmation = async () => {
    const email = form.getValues("email")
    if (!email) {
      toast.error("Email requerido", {
        description: "Por favor ingresa tu correo electrónico",
      })
      return
    }

    const supabase = createClient()
    setIsResending(true)

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      toast.success("Correo reenviado", {
        description: "Por favor revisa tu bandeja de entrada.",
      })
      setShowEmailNotConfirmed(false)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al reenviar el correo"
      toast.error("Error", {
        description: errorMessage,
      })
    } finally {
      setIsResending(false)
    }
  }

  const onSubmit = async (data: LoginInput) => {
    const supabase = createClient()
    setShowEmailNotConfirmed(false)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        if (error.message.includes("Email not confirmed") || error.message.includes("Invalid login credentials")) {
          setShowEmailNotConfirmed(true)
          toast.error("Email no confirmado", {
            description: "Tu correo electrónico aún no ha sido confirmado. Por favor revisa tu bandeja de entrada.",
          })
        } else {
          toast.error("Error de inicio de sesión", {
            description: error.message,
          })
        }
        return
      }

      toast.success("Sesión iniciada", {
        description: "Bienvenido de vuelta.",
      })

      router.push("/dashboard")
      router.refresh()
    } catch (error: unknown) {
      // Error already handled above
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600" role="img" aria-label="RepairTech Logo">
            <Wrench className="h-8 w-8 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">RepairTech</h1>
          <p className="text-slate-600">Gestión de reparaciones</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email">Correo electrónico</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                            {...field}
                            aria-required="true"
                            autoComplete="email"
                          />
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
                          <Input
                            id="password"
                            type="password"
                            {...field}
                            aria-required="true"
                            autoComplete="current-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {showEmailNotConfirmed && (
                    <Alert className="border-amber-200 bg-amber-50">
                      <AlertCircle className="h-4 w-4 text-amber-600" aria-hidden="true" />
                      <AlertDescription className="text-amber-800">
                        Tu correo electrónico aún no ha sido confirmado. Por favor revisa tu bandeja de entrada.
                      </AlertDescription>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-3 w-full bg-transparent"
                        onClick={handleResendConfirmation}
                        disabled={isResending}
                      >
                        {isResending ? "Reenviando..." : "Reenviar correo de confirmación"}
                      </Button>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  ¿No tienes cuenta?{" "}
                  <Link href="/auth/register" className="font-medium text-blue-600 hover:underline">
                    Regístrate
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
