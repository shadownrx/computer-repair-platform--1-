import { z } from "zod"

// Computer form schema
export const computerFormSchema = z.object({
  customer_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100, "El nombre es demasiado largo"),
  customer_email: z.string().email("Email inválido").max(255, "El email es demasiado largo"),
  customer_phone: z.string().optional().or(z.literal("")),
  brand: z.string().min(1, "La marca es requerida").max(100, "La marca es demasiado larga"),
  model: z.string().min(1, "El modelo es requerido").max(100, "El modelo es demasiado largo"),
  serial_number: z.string().optional().or(z.literal("")),
  issue_description: z.string().min(10, "La descripción debe tener al menos 10 caracteres").max(2000, "La descripción es demasiado larga"),
  status: z.enum(["pending", "in_progress", "completed", "needs_repair"], {
    errorMap: () => ({ message: "Estado inválido" }),
  }),
  technician_notes: z.string().optional().or(z.literal("")),
  estimated_cost: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val: string) => {
        if (!val || val === "") return true
        const num = Number.parseFloat(val)
        return !Number.isNaN(num) && num >= 0
      },
      { message: "El costo debe ser un número válido mayor o igual a 0" },
    ),
})

export type ComputerFormInput = z.infer<typeof computerFormSchema>

// Profile form schema
export const profileFormSchema = z.object({
  full_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100, "El nombre es demasiado largo"),
  phone: z.string().optional().or(z.literal("")),
})

export type ProfileFormInput = z.infer<typeof profileFormSchema>

// Track ticket form schema
export const trackTicketSchema = z.object({
  ticket_number: z
    .string()
    .min(1, "El número de ticket es requerido")
    .regex(/^RT-\d{8}-\d{4}$/i, "Formato de ticket inválido. Debe ser RT-YYYYMMDD-XXXX"),
})

export type TrackTicketInput = z.infer<typeof trackTicketSchema>

// Login form schema
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export type LoginInput = z.infer<typeof loginSchema>

// Register form schema
export const registerSchema = z
  .object({
    fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100, "El nombre es demasiado largo"),
    email: z.string().email("Email inválido").max(255, "El email es demasiado largo"),
    phone: z.string().optional().or(z.literal("")),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").max(100, "La contraseña es demasiado larga"),
    confirmPassword: z.string(),
  })
  .refine((data: { password: string; confirmPassword: string }) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export type RegisterInput = z.infer<typeof registerSchema>

