import type * as React from "react"

interface TicketEmailTemplateProps {
  customerName: string
  ticketNumber: string
  brand: string
  model: string
  issueDescription: string
}

export const TicketEmailTemplate: React.FC<Readonly<TicketEmailTemplateProps>> = ({
  customerName,
  ticketNumber,
  brand,
  model,
  issueDescription,
}) => (
  <div
    style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#f9fafb",
    }}
  >
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        padding: "40px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#111827",
            margin: "0 0 8px 0",
          }}
        >
          RepairTech
        </h1>
        <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>Servicio Técnico Profesional</p>
      </div>

      {/* Greeting */}
      <p style={{ fontSize: "16px", color: "#374151", marginBottom: "24px" }}>Hola {customerName},</p>

      <p style={{ fontSize: "16px", color: "#374151", marginBottom: "24px" }}>
        Hemos recibido tu equipo y lo hemos registrado en nuestro sistema. A continuación encontrarás los detalles de tu
        ticket de reparación:
      </p>

      {/* Ticket Number - Highlighted */}
      <div
        style={{
          backgroundColor: "#f3f4f6",
          border: "2px solid #3b82f6",
          borderRadius: "8px",
          padding: "24px",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 8px 0", textTransform: "uppercase" }}>
          Número de Ticket
        </p>
        <p
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#3b82f6",
            margin: 0,
            letterSpacing: "1px",
          }}
        >
          {ticketNumber}
        </p>
      </div>

      {/* Computer Details */}
      <div
        style={{
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#111827",
            margin: "0 0 16px 0",
          }}
        >
          Detalles del Equipo
        </h2>

        <div style={{ marginBottom: "12px" }}>
          <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>Marca: </span>
          <span style={{ fontSize: "14px", color: "#111827" }}>{brand}</span>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>Modelo: </span>
          <span style={{ fontSize: "14px", color: "#111827" }}>{model}</span>
        </div>

        <div>
          <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>Problema reportado: </span>
          <p style={{ fontSize: "14px", color: "#111827", margin: "4px 0 0 0" }}>{issueDescription}</p>
        </div>
      </div>

      {/* Track Status CTA */}
      <div
        style={{
          backgroundColor: "#eff6ff",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "14px", color: "#1e40af", margin: "0 0 16px 0" }}>
          Puedes rastrear el estado de tu reparación en cualquier momento
        </p>
        <a
          href={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/track`}
          style={{
            display: "inline-block",
            backgroundColor: "#3b82f6",
            color: "#ffffff",
            padding: "12px 32px",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          Rastrear mi Reparación
        </a>
      </div>

      {/* Instructions */}
      <div
        style={{
          borderTop: "1px solid #e5e7eb",
          paddingTop: "24px",
          marginTop: "24px",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#111827",
            margin: "0 0 12px 0",
          }}
        >
          ¿Qué sigue?
        </h3>
        <ul style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6", paddingLeft: "20px" }}>
          <li>Nuestro equipo técnico revisará tu equipo en las próximas 24-48 horas</li>
          <li>Recibirás actualizaciones por email cuando cambie el estado de tu reparación</li>
          <li>Usa tu número de ticket para consultar el estado en cualquier momento</li>
        </ul>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid #e5e7eb",
          paddingTop: "24px",
          marginTop: "32px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 8px 0" }}>
          Guarda este email para futuras referencias
        </p>
        <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
          RepairTech - Servicio Técnico Profesional
          <br />
          Si tienes alguna pregunta, no dudes en contactarnos
        </p>
      </div>
    </div>
  </div>
)
