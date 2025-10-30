import { ComputerForm } from "@/components/computer-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewComputerPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Agregar Computadora</h1>
        <p className="text-slate-600">Registra una nueva computadora para darle seguimiento</p>
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
