import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileForm } from "@/components/profile-form"
import { Button } from "@/components/ui/button"
import { User, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-5 w-5" aria-label="Volver al dashboard" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mi Perfil</h1>
          <p className="text-slate-600">Administra tu información personal</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>Información personal</CardTitle>
              <CardDescription>Actualiza tus datos de contacto</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} userEmail={user.email || ""} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información de la cuenta</CardTitle>
          <CardDescription>Detalles de tu cuenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-700">Correo electrónico</p>
            <p className="text-slate-900">{user.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">ID de usuario</p>
            <p className="font-mono text-sm text-slate-600">{user.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Fecha de registro</p>
            <p className="text-slate-900">
              {new Date(user.created_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
