"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Laptop, Bell, User } from "lucide-react"
import { motion } from "framer-motion"

const navItems = [
  {
    title: "Inicio",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Computadoras",
    href: "/dashboard/computers",
    icon: Laptop,
  },
  {
    title: "Notificaciones",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Perfil",
    href: "/dashboard/profile",
    icon: User,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <motion.nav
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="hidden w-64 border-r bg-card p-6 lg:block"
    >
      <div className="space-y-2">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <motion.div
              key={item.href}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm dark:bg-blue-950 dark:text-blue-400"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.nav>
  )
}
