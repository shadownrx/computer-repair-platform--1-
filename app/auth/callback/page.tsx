import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string; error_description?: string }>
}) {
  const params = await searchParams
  const { code, error, error_description } = params

  if (error) {
    console.error("[v0] Auth callback error:", error, error_description)
    redirect(`/auth/login?error=${encodeURIComponent(error_description || error)}`)
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error("[v0] Code exchange error:", exchangeError)
      redirect(`/auth/login?error=${encodeURIComponent(exchangeError.message)}`)
    }

    // Successfully authenticated, redirect to dashboard
    redirect("/dashboard")
  }

  // No code or error, redirect to login
  redirect("/auth/login")
}
