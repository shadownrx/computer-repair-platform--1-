"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useSearchParams } from "next/navigation"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendError, setResendError] = useState<string | null>(null)

  const handleResendEmail = async () => {
    if (!email) {
      setResendError("No se encontró el correo electrónico")
      return
    }

    setIsResending(true)
    setResendError(null)
    setResendSuccess(false)

    try {
      const supabase = createClient()
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
    } catch (error: unknown) {
      setResendError(error instanceof Error ? error.message : "Error al reenviar el correo")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl">Verifica tu correo</CardTitle>
            <CardDescription>Te hemos enviado un correo de confirmación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Revisa tu bandeja de entrada</AlertTitle>
              <AlertDescription>
                Por favor revisa tu correo {email && <strong>({email})</strong>} y haz clic en el enlace de verificación
                para activar tu cuenta.
              </AlertDescription>
            </Alert>

            <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">¿No recibiste el correo?</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-amber-800 dark:text-amber-200">
                <li>Revisa tu carpeta de spam o correo no deseado</li>
                <li>Verifica que el correo electrónico sea correcto</li>
                <li>El correo puede tardar unos minutos en llegar</li>
                <li>Intenta reenviar el correo usando el botón de abajo</li>
              </ul>
            </div>

            {email && (
              <div className="space-y-2">
                <Button
                  onClick={handleResendEmail}
                  disabled={isResending}
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isResending ? "animate-spin" : ""}`} />
                  {isResending ? "Reenviando..." : "Reenviar correo de confirmación"}
                </Button>

                {resendSuccess && (
                  <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      Correo reenviado exitosamente. Revisa tu bandeja de entrada.
                    </AlertDescription>
                  </Alert>
                )}

                {resendError && (
                  <Alert variant="destructive">
                    <AlertDescription>{resendError}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Configuración de Supabase</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Si los correos no llegan, es posible que necesites configurar el servicio de email en tu proyecto de
                Supabase. Ve a tu dashboard de Supabase → Authentication → Email Templates para verificar la
                configuración.
              </p>
            </div>

            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/auth/login">Volver al inicio de sesión</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
