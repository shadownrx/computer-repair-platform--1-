import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Laptop } from "lucide-react"
import Link from "next/link"
import { ComputerCard } from "@/components/computer-card"

export default async function ComputersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: computers } = await supabase
    .from("computers")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mis Computadoras</h1>
          <p className="text-slate-600">Gestiona todas tus computadoras en reparación</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/computers/new">
            <Plus className="mr-2 h-4 w-4" />
            Agregar computadora
          </Link>
        </Button>
      </div>

      {computers && computers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {computers.map((computer) => (
            <ComputerCard key={computer.id} computer={computer} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Laptop className="mx-auto h-16 w-16 text-slate-300" />
              <h3 className="mt-4 text-lg font-medium text-slate-900">No hay computadoras registradas</h3>
              <p className="mt-2 text-sm text-slate-500">
                Comienza agregando tu primera computadora para darle seguimiento
              </p>
              <Button asChild className="mt-6">
                <Link href="/dashboard/computers/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar computadora
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
