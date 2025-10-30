import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Laptop, Clock, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get user's computers
  const { data: computers } = await supabase
    .from("computers")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  // Get statistics
  const totalComputers = computers?.length || 0
  const pendingComputers = computers?.filter((c) => c.status === "pending").length || 0
  const inProgressComputers = computers?.filter((c) => c.status === "in_progress").length || 0
  const completedComputers = computers?.filter((c) => c.status === "completed").length || 0

  // Get recent notifications
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Panel de Control</h1>
        <p className="text-slate-600">Bienvenido a tu panel de gestión de reparaciones</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total</CardTitle>
            <Laptop className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComputers}</div>
            <p className="text-xs text-slate-500">Computadoras registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingComputers}</div>
            <p className="text-xs text-slate-500">En espera de revisión</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">En Progreso</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressComputers}</div>
            <p className="text-xs text-slate-500">Siendo reparadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedComputers}</div>
            <p className="text-xs text-slate-500">Reparaciones finalizadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Computers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Computadoras Recientes</CardTitle>
              <CardDescription>Últimas computadoras registradas</CardDescription>
            </div>
            <Button asChild>
              <Link href="/dashboard/computers">Ver todas</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {computers && computers.length > 0 ? (
            <div className="space-y-4">
              {computers.slice(0, 5).map((computer) => (
                <div key={computer.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                      <Laptop className="h-6 w-6 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {computer.brand} {computer.model}
                      </p>
                      <p className="text-sm text-slate-500">{computer.issue_description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                        computer.status === "pending" && "bg-amber-100 text-amber-700",
                        computer.status === "in_progress" && "bg-blue-100 text-blue-700",
                        computer.status === "completed" && "bg-green-100 text-green-700",
                        computer.status === "needs_repair" && "bg-red-100 text-red-700",
                      )}
                    >
                      {computer.status === "pending" && "Pendiente"}
                      {computer.status === "in_progress" && "En progreso"}
                      {computer.status === "completed" && "Completada"}
                      {computer.status === "needs_repair" && "Necesita reparación"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Laptop className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-lg font-medium text-slate-900">No hay computadoras registradas</h3>
              <p className="mt-2 text-sm text-slate-500">Comienza agregando tu primera computadora</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/computers">Agregar computadora</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      {notifications && notifications.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Notificaciones Recientes</CardTitle>
                <CardDescription>Últimas actualizaciones</CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link href="/dashboard/notifications">Ver todas</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "rounded-lg border p-4",
                    notification.is_read ? "bg-white" : "bg-blue-50 border-blue-200",
                  )}
                >
                  <p className="font-medium text-slate-900">{notification.title}</p>
                  <p className="text-sm text-slate-600">{notification.message}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(notification.created_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
