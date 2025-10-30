import { NextResponse } from "next/server"
import { Resend } from "resend"
import { TicketEmailTemplate } from "@/components/email-templates/ticket-email"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customerEmail, customerName, ticketNumber, brand, model, issueDescription } = body

    console.log("[v0] Sending ticket email to:", customerEmail)

    if (!customerEmail || !ticketNumber) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
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
      console.error("[v0] Error sending email:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] Email sent successfully:", data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Error in send-ticket-email route:", error)
    return NextResponse.json({ error: "Error al enviar el email" }, { status: 500 })
  }
}
