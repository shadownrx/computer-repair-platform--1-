import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Bell } from "lucide-react"
import { NotificationItem } from "@/components/notification-item"
import { MarkAllReadButton } from "@/components/mark-all-read-button"

export default async function NotificationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*, computers(brand, model)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notificaciones</h1>
          <p className="text-slate-600">
            {unreadCount > 0
              ? `Tienes ${unreadCount} notificación${unreadCount > 1 ? "es" : ""} sin leer`
              : "No tienes notificaciones sin leer"}
          </p>
        </div>
        {unreadCount > 0 && <MarkAllReadButton />}
      </div>

      {notifications && notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Bell className="mx-auto h-16 w-16 text-slate-300" />
              <h3 className="mt-4 text-lg font-medium text-slate-900">No hay notificaciones</h3>
              <p className="mt-2 text-sm text-slate-500">
                Cuando haya actualizaciones en tus computadoras, aparecerán aquí
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
