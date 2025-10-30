"use client"

import { Search, Mail, Clock } from "lucide-react"
import { TrackTicketForm } from "@/components/track-ticket-form"
import { motion } from "framer-motion"

export default function TrackPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-purple-200/30 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          className="mx-auto max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 text-center">
            <motion.div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg"
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Search className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="mb-2 text-balance text-3xl font-bold text-gray-900">Rastrear Reparación</h1>
            <p className="text-pretty text-gray-600">
              Ingresa tu número de ticket para ver el estado de tu computadora
            </p>
          </div>

          <TrackTicketForm />

          <motion.div
            className="mt-8 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-blue-900">¿Dónde encuentro mi ticket?</h3>
                  <p className="text-sm text-blue-700">
                    Tu número de ticket fue enviado a tu correo electrónico cuando registraste tu computadora. Tiene el
                    formato: <span className="font-mono font-semibold">RT-YYYYMMDD-XXXX</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-600">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-purple-900">Actualizaciones en tiempo real</h3>
                  <p className="text-sm text-purple-700">
                    El estado de tu reparación se actualiza automáticamente. Recibirás notificaciones por email cuando
                    haya cambios.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
