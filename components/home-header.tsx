"use client"

import { Button } from "@/components/ui/button"
import { Wrench, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function HomeHeader() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }
    checkAuth()
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-950/95 dark:supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <Wrench className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">RepairTech</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">Gestión de reparaciones</p>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link href="/track">Rastrear ticket</Link>
          </Button>
          {isAuthenticated ? (
            <Button asChild>
              <Link href="/dashboard">
                Ir al Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/auth/login">
                  <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
                  Iniciar sesión
                </Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">
                  <UserPlus className="mr-2 h-4 w-4" aria-hidden="true" />
                  Registrarse
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

