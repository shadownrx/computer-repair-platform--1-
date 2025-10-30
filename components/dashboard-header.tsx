"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, User, LogOut, Wrench, Settings } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"

interface DashboardHeaderProps {
  user: any
  profile: any
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const router = useRouter()
  const supabase = createClient()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const { count } = await supabase
          .from("notifications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("is_read", false)

        setUnreadCount(count || 0)
      } catch (error) {
        console.error("[v0] Error fetching unread count:", error)
      }
    }

    fetchUnreadCount()

    const channel = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Debounce the fetch to avoid too many calls
          setTimeout(fetchUnreadCount, 500)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, user.id])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500"
          >
            <Wrench className="h-5 w-5 text-white" />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold">RepairTech</h1>
            <p className="text-xs text-muted-foreground">Gestión de reparaciones</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/dashboard/notifications">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full p-0 text-xs">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                </motion.div>
              )}
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="hidden text-sm font-medium md:inline-block">{profile?.full_name || "Usuario"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{profile?.full_name || "Usuario"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  )
}
