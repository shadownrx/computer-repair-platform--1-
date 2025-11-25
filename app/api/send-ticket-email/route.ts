import { NextResponse } from "next/server"
import { Resend } from "resend"
import { TicketEmailTemplate } from "@/components/email-templates/ticket-email"
import { z } from "zod"
import { logError, formatError } from "@/lib/error-handler"

const resend = new Resend(process.env.RESEND_API_KEY)

const emailRequestSchema = z.object({
  customerEmail: z.string().email("Email inválido"),
  customerName: z.string().min(1, "El nombre es requerido"),
  ticketNumber: z.string().min(1, "El número de ticket es requerido"),
  brand: z.string().min(1, "La marca es requerida"),
  model: z.string().min(1, "El modelo es requerido"),
  issueDescription: z.string().min(1, "La descripción es requerida"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate request body with Zod
    const validationResult = emailRequestSchema.safeParse(body)
    if (!validationResult.success) {
      logError(validationResult.error, { endpoint: "/api/send-ticket-email", action: "validation" })
      return NextResponse.json(
        { error: "Datos inválidos", details: validationResult.error.errors },
        { status: 400 },
      )
    }

    const { customerEmail, customerName, ticketNumber, brand, model, issueDescription } = validationResult.data

    // Validate RESEND_API_KEY is set
    if (!process.env.RESEND_API_KEY) {
      logError("RESEND_API_KEY not configured", { endpoint: "/api/send-ticket-email" })
      return NextResponse.json({ error: "Configuración del servidor incompleta" }, { status: 500 })
    }

    const { data, error } = await resend.emails.send({
      from: "RepairTech <onboarding@resend.dev>",
      to: [customerEmail],
      subject: `Ticket de Reparación #${ticketNumber} - RepairTech`,
      react: TicketEmailTemplate({
        customerName,
        ticketNumber,
        brand,
        model,
        issueDescription,
      }),
    })

    if (error) {
      logError(error, {
        endpoint: "/api/send-ticket-email",
        action: "send_email",
        customerEmail,
        ticketNumber,
      })
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    logError(error, { endpoint: "/api/send-ticket-email", action: "unexpected_error" })
    return NextResponse.json(
      { error: formatError(error) },
      { status: 500 },
    )
  }
}
