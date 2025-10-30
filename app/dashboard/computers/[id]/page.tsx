import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Laptop, Calendar, DollarSign, FileText, Wrench, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { DeleteComputerButton } from "@/components/delete-computer-button"

export default async function ComputerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: computer, error } = await supabase
    .from("computers")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single()

  if (error || !computer) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "in_progress":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-700 border-green-200"
      case "needs_repair":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "in_progress":
        return "En progreso"
      case "completed":
        return "Completada"
      case "needs_repair":
        return "Necesita reparación"
      default:
        return status
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/computers">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900">
            {computer.brand} {computer.model}
          </h1>
          <p className="text-slate-600">Detalles de la computadora</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="bg-transparent">
            <Link href={`/dashboard/computers/${computer.id}/edit`}>Editar</Link>
          </Button>
          <DeleteComputerButton computerId={computer.id} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Información general</CardTitle>
              <Badge className={getStatusColor(computer.status)}>{getStatusText(computer.status)}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Laptop className="h-4 w-4" />
                  Marca
                </div>
                <p className="mt-1 text-slate-900">{computer.brand}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Laptop className="h-4 w-4" />
                  Modelo
                </div>
                <p className="mt-1 text-slate-900">{computer.model}</p>
              </div>

              {computer.serial_number && (
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <FileText className="h-4 w-4" />
                    Número de serie
                  </div>
                  <p className="mt-1 text-slate-900">{computer.serial_number}</p>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Calendar className="h-4 w-4" />
                  Fecha de registro
                </div>
                <p className="mt-1 text-slate-900">
                  {new Date(computer.created_at).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {computer.estimated_cost && (
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <DollarSign className="h-4 w-4" />
                    Costo estimado
                  </div>
                  <p className="mt-1 text-slate-900">${computer.estimated_cost}</p>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Calendar className="h-4 w-4" />
                  Última actualización
                </div>
                <p className="mt-1 text-slate-900">
                  {new Date(computer.updated_at).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Wrench className="h-4 w-4" />
                Descripción del problema
              </div>
              <p className="mt-2 text-slate-900">{computer.issue_description}</p>
            </div>

            {computer.technician_notes && (
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FileText className="h-4 w-4" />
                  Notas del técnico
                </div>
                <p className="mt-2 text-slate-900">{computer.technician_notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial de estados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Estado actual</p>
                  <p className="text-sm text-slate-600">{getStatusText(computer.status)}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(computer.updated_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-slate-300" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Registrada</p>
                  <p className="text-xs text-slate-400">
                    {new Date(computer.created_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
