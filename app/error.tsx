"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Application error:", error)
    }
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-600" aria-hidden="true" />
          </div>
          <CardTitle className="text-center text-2xl">Algo salió mal</CardTitle>
          <CardDescription className="text-center">
            Ocurrió un error inesperado. Por favor intenta recargar la página.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === "development" && (
            <div className="rounded-md bg-slate-100 p-3">
              <p className="text-xs font-mono text-slate-600">{error.message}</p>
              {error.digest && (
                <p className="mt-1 text-xs font-mono text-slate-500">Digest: {error.digest}</p>
              )}
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={reset} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
              Intentar de nuevo
            </Button>
            <Button variant="outline" asChild className="flex-1 bg-transparent">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                Ir al inicio
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

