import { ComputerForm } from "@/components/computer-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewComputerPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/computers">
            <ArrowLeft className="h-5 w-5" aria-label="Volver a computadoras" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Agregar Computadora</h1>
          <p className="text-slate-600">Registra una nueva computadora para darle seguimiento</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la computadora</CardTitle>
          <CardDescription>Completa los detalles de la computadora que deseas registrar</CardDescription>
        </CardHeader>
        <CardContent>
          <ComputerForm />
        </CardContent>
      </Card>
    </div>
  )
}
