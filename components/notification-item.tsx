"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Laptop } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface NotificationItemProps {
  notification: any
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isMarking, setIsMarking] = useState(false)

  const handleMarkAsRead = async () => {
    if (notification.is_read) return

    setIsMarking(true)
    try {
      await supabase.from("notifications").update({ is_read: true }).eq("id", notification.id)
      router.refresh()
    } catch (error) {
      console.error("Error marking notification as read:", error)
    } finally {
      setIsMarking(false)
    }
  }

  return (
    <Card className={notification.is_read ? "bg-white" : "border-blue-200 bg-blue-50"}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${notification.is_read ? "bg-slate-100" : "bg-blue-100"}`}
          >
            <Laptop className={`h-5 w-5 ${notification.is_read ? "text-slate-600" : "text-blue-600"}`} />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                <p className="text-sm text-slate-600">{notification.message}</p>
                {notification.computers && (
                  <p className="mt-1 text-xs text-slate-500">
                    {notification.computers.brand} {notification.computers.model}
                  </p>
                )}
              </div>

              {!notification.is_read && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleMarkAsRead}
                  disabled={isMarking}
                  className="flex-shrink-0"
                >
                  <Check className="mr-1 h-4 w-4" />
                  Marcar como leída
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">
                {new Date(notification.created_at).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              {notification.computer_id && (
                <Button variant="link" size="sm" asChild className="h-auto p-0 text-xs">
                  <Link href={`/dashboard/computers/${notification.computer_id}`}>Ver computadora</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
