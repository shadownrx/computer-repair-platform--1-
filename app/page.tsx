"use client"

import { Button } from "@/components/ui/button"
import { Wrench, Shield, Bell, Search, ArrowRight, CheckCircle, Zap } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 px-6 py-20 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -left-4 top-1/4 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -right-4 bottom-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>

        <motion.div
          className="relative z-10 max-w-4xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Wrench className="h-10 w-10" />
          </motion.div>

          <motion.h1
            className="mb-6 text-balance text-5xl font-bold leading-tight lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Gestiona tus reparaciones de forma inteligente
          </motion.h1>

          <motion.p
            className="mb-8 text-pretty text-xl text-blue-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            RepairTech te ayuda a llevar un control completo de todas tus computadoras en reparación con notificaciones
            en tiempo real
          </motion.p>

          <motion.div
            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" asChild className="bg-white text-blue-600 shadow-lg hover:bg-blue-50 hover:shadow-xl">
                <Link href="/track">
                  <Search className="mr-2 h-5 w-5" />
                  Rastrear reparación
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                asChild
                variant="outline"
                className="border-2 border-white bg-transparent text-white backdrop-blur-sm hover:bg-white/10"
              >
                <Link href="/auth/login">Iniciar sesión</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 text-balance text-center text-3xl font-bold text-slate-900">
              Características principales
            </h2>
            <p className="mb-12 text-pretty text-center text-slate-600">
              Todo lo que necesitas para gestionar tus reparaciones de manera profesional
            </p>
          </motion.div>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div variants={item} whileHover={{ y: -8, transition: { duration: 0.2 } }}>
              <div className="group h-full rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-xl">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900">Rastreo por ticket</h3>
                <p className="text-slate-600">
                  Los clientes pueden rastrear el estado de su reparación con un número de ticket único
                </p>
              </div>
            </motion.div>

            <motion.div variants={item} whileHover={{ y: -8, transition: { duration: 0.2 } }}>
              <div className="group h-full rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-xl">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900">Gestión completa</h3>
                <p className="text-slate-600">
                  Registra y administra todas tus computadoras en un solo lugar con información detallada
                </p>
              </div>
            </motion.div>

            <motion.div variants={item} whileHover={{ y: -8, transition: { duration: 0.2 } }}>
              <div className="group h-full rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-xl">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900">Notificaciones automáticas</h3>
                <p className="text-slate-600">
                  Recibe actualizaciones instantáneas cuando el estado de tu reparación cambie
                </p>
              </div>
            </motion.div>

            <motion.div variants={item} whileHover={{ y: -8, transition: { duration: 0.2 } }}>
              <div className="group h-full rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-xl">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900">Seguro y confiable</h3>
                <p className="text-slate-600">Tus datos están protegidos con las mejores prácticas de seguridad</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-blue-600 to-purple-700 px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 text-balance text-3xl font-bold">¿Por qué elegir RepairTech?</h2>
            <p className="mb-12 text-pretty text-xl text-blue-100">
              La solución completa para gestionar tu taller de reparaciones
            </p>

            <motion.div
              className="mb-12 grid gap-6 text-left md:grid-cols-3"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <motion.div variants={item} className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-green-300" />
                <div>
                  <h3 className="mb-1 font-semibold">Fácil de usar</h3>
                  <p className="text-sm text-blue-100">Interfaz intuitiva que no requiere capacitación</p>
                </div>
              </motion.div>

              <motion.div variants={item} className="flex items-start gap-3">
                <Zap className="mt-1 h-6 w-6 flex-shrink-0 text-yellow-300" />
                <div>
                  <h3 className="mb-1 font-semibold">Rápido y eficiente</h3>
                  <p className="text-sm text-blue-100">Ahorra tiempo en la gestión diaria</p>
                </div>
              </motion.div>

              <motion.div variants={item} className="flex items-start gap-3">
                <Shield className="mt-1 h-6 w-6 flex-shrink-0 text-blue-300" />
                <div>
                  <h3 className="mb-1 font-semibold">100% Seguro</h3>
                  <p className="text-sm text-blue-100">Protección de datos garantizada</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" asChild className="bg-white text-blue-600 shadow-xl hover:bg-blue-50">
                <Link href="/auth/register">
                  Comenzar gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-slate-600">
          <p>&copy; 2025 RepairTech. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
