import { z } from "zod"

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL debe ser una URL válida"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY es requerido"),
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY es requerido").optional(),
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL debe ser una URL válida").optional(),
  NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL: z.string().url("NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL debe ser una URL válida").optional(),
})

type Env = z.infer<typeof envSchema>

function getEnv(): Env {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL,
    })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err: z.ZodIssue) => `${err.path.join(".")}: ${err.message}`).join("\n")
      throw new Error(`Variables de entorno faltantes o inválidas:\n${missingVars}`)
    }
    throw error
  }
}

export const env = getEnv()

