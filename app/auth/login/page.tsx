"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Wrench, AlertCircle, Mail } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [showEmailNotConfirmed, setShowEmailNotConfirmed] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }
  }, [searchParams])

  const handleResendConfirmation = async () => {
    if (!email) {
      setError("Por favor ingresa tu correo electrónico")
      return
    }

    const supabase = createClient()
    setIsResending(true)
    setError(null)

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

      setResendSuccess(true)
      setShowEmailNotConfirmed(false)
      setTimeout(() => setResendSuccess(false), 5000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al reenviar el correo")
    } finally {
      setIsResending(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    setShowEmailNotConfirmed(false)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes("Email not confirmed") || error.message.includes("Invalid login credentials")) {
          setShowEmailNotConfirmed(true)
          setError("Tu correo electrónico aún no ha sido confirmado. Por favor revisa tu bandeja de entrada.")
        } else {
          setError(error.message)
        }
        throw error
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error: unknown) {
      // Error already handled above
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
            <Wrench className="h-8 w-8 text-white" />
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
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {resendSuccess && (
                  <Alert className="border-green-200 bg-green-50">
                    <Mail className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Correo de confirmación reenviado. Por favor revisa tu bandeja de entrada.
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <div className="space-y-3">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>

                    {showEmailNotConfirmed && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={handleResendConfirmation}
                        disabled={isResending}
                      >
                        {isResending ? "Reenviando..." : "Reenviar correo de confirmación"}
                      </Button>
                    )}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                ¿No tienes cuenta?{" "}
                <Link href="/auth/register" className="font-medium text-blue-600 hover:underline">
                  Regístrate
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
