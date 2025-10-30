import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ComputerForm } from "@/components/computer-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EditComputerPage({ params }: { params: Promise<{ id: string }> }) {
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

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/computers/${computer.id}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Editar Computadora</h1>
          <p className="text-slate-600">
            {computer.brand} {computer.model}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la computadora</CardTitle>
          <CardDescription>Actualiza los detalles de la computadora</CardDescription>
        </CardHeader>
        <CardContent>
          <ComputerForm computer={computer} isEdit />
        </CardContent>
      </Card>
    </div>
  )
}
