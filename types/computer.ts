export type ComputerStatus = "pending" | "in_progress" | "completed" | "needs_repair"

export interface Computer {
  id: string
  owner_id: string
  ticket_number: string | null
  customer_name: string
  customer_email: string
  customer_phone: string | null
  brand: string
  model: string
  serial_number: string | null
  issue_description: string
  status: ComputerStatus
  technician_notes: string | null
  estimated_cost: number | null
  created_at: string
  updated_at: string
}

export interface ComputerFormData {
  customer_name: string
  customer_email: string
  customer_phone: string
  brand: string
  model: string
  serial_number: string
  issue_description: string
  status: ComputerStatus
  technician_notes: string
  estimated_cost: string
}

