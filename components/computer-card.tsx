"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Laptop, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface ComputerCardProps {
  computer: any
}

export function ComputerCard({ computer }: ComputerCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "in_progress":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-700 border-green-200"
      case "needs_repair":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "in_progress":
        return "En progreso"
      case "completed":
        return "Completada"
      case "needs_repair":
        return "Necesita reparación"
      default:
        return status
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="flex flex-col transition-shadow hover:shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                <Laptop className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  {computer.brand} {computer.model}
                </h3>
                {computer.serial_number && <p className="text-xs text-slate-500">S/N: {computer.serial_number}</p>}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-3">
          <Badge className={getStatusColor(computer.status)}>{getStatusText(computer.status)}</Badge>
          <div>
            <p className="text-sm font-medium text-slate-700">Problema:</p>
            <p className="text-sm text-slate-600 line-clamp-2">{computer.issue_description}</p>
          </div>
          {computer.technician_notes && (
            <div>
              <p className="text-sm font-medium text-slate-700">Notas del técnico:</p>
              <p className="text-sm text-slate-600 line-clamp-2">{computer.technician_notes}</p>
            </div>
          )}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(computer.created_at).toLocaleDateString("es-ES")}
            </div>
            {computer.estimated_cost && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />${computer.estimated_cost}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button asChild variant="outline" className="flex-1 bg-transparent">
            <Link href={`/dashboard/computers/${computer.id}`}>Ver detalles</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href={`/dashboard/computers/${computer.id}/edit`}>Editar</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
