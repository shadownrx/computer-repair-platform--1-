"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Wrench, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function RegisterPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    try {
      const redirectUrl = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      })

      if (error) throw error

      if (data.user && !data.user.confirmed_at) {
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`)
      } else if (data.user && data.user.confirmed_at) {
        router.push("/dashboard")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al registrarse")
    } finally {
      setIsLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:from-slate-950 dark:to-slate-900">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
              <Wrench className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">RepairTech</h1>
            <p className="text-slate-600 dark:text-slate-400">Gestión de reparaciones</p>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl">¡Cuenta Creada!</CardTitle>
              <CardDescription>Revisa tu correo para confirmar tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Verifica tu correo electrónico</AlertTitle>
                <AlertDescription>
                  Hemos enviado un correo de confirmación a <strong>{email}</strong>. Haz clic en el enlace del correo
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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
            <Wrench className="h-8 w-8 text-white" />
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
            <form onSubmit={handleRegister}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Nombre completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Juan Pérez"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
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
                  <Label htmlFor="phone">Teléfono (opcional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creando cuenta..." : "Registrarse"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                ¿Ya tienes cuenta?{" "}
                <Link href="/auth/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                  Inicia sesión
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
