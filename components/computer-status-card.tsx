"use client"

import { Calendar, Clock, DollarSign, FileText, Wrench, User, Mail, Phone } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface ComputerStatusCardProps {
  computer: any
}

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  in_progress: { label: "En progreso", color: "bg-blue-100 text-blue-800 border-blue-200" },
  needs_repair: { label: "Necesita reparación", color: "bg-orange-100 text-orange-800 border-orange-200" },
  completed: { label: "Completada", color: "bg-green-100 text-green-800 border-green-200" },
}

export function ComputerStatusCard({ computer }: ComputerStatusCardProps) {
  const status = statusConfig[computer.status as keyof typeof statusConfig]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">
                {computer.brand} {computer.model}
              </CardTitle>
              <CardDescription className="mt-1 font-mono text-sm">
                Ticket: <span className="font-semibold">{computer.ticket_number}</span>
              </CardDescription>
            </div>
            <Badge className={`${status.color} border`}>{status.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <motion.div
              className="flex items-start gap-3 rounded-lg bg-slate-50 p-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-700">Problema reportado</p>
                <p className="text-sm text-gray-600">{computer.issue_description}</p>
              </div>
            </motion.div>

            {computer.technician_notes && (
              <motion.div
                className="flex items-start gap-3 rounded-lg bg-blue-50 p-3"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Wrench className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Notas del técnico</p>
                  <p className="text-sm text-gray-600">{computer.technician_notes}</p>
                </div>
              </motion.div>
            )}

            {computer.estimated_cost && (
              <motion.div
                className="flex items-start gap-3 rounded-lg bg-green-50 p-3"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <DollarSign className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Costo estimado</p>
                  <p className="text-lg font-semibold text-green-600">
                    ${Number.parseFloat(computer.estimated_cost).toFixed(2)}
                  </p>
                </div>
              </motion.div>
            )}

            <div className="grid gap-3 md:grid-cols-2">
              <motion.div
                className="flex items-start gap-3 rounded-lg bg-slate-50 p-3"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Fecha de ingreso</p>
                  <p className="text-sm text-gray-600">{new Date(computer.created_at).toLocaleDateString("es-ES")}</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-3 rounded-lg bg-slate-50 p-3"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Última actualización</p>
                  <p className="text-sm text-gray-600">{new Date(computer.updated_at).toLocaleDateString("es-ES")}</p>
                </div>
              </motion.div>
            </div>
          </div>

          {computer.customer_name && (
            <motion.div
              className="mt-6 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <User className="h-4 w-4" />
                Información del cliente
              </h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Nombre:</span> {computer.customer_name}
                </p>
                {computer.customer_email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Email:</span> {computer.customer_email}
                  </p>
                )}
                {computer.customer_phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Teléfono:</span> {computer.customer_phone}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
