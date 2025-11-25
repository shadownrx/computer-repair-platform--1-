# RepairTech - Plataforma de Gestión de Reparaciones

Sistema completo para gestionar reparaciones de computadoras con seguimiento de tickets, notificaciones automáticas y panel de control intuitivo.

## Características

- ✅ **Gestión de Computadoras**: Registro y seguimiento completo de computadoras en reparación
- ✅ **Sistema de Tickets**: Generación automática de tickets únicos para cada reparación
- ✅ **Notificaciones**: Notificaciones automáticas por email cuando cambia el estado de una reparación
- ✅ **Rastreo Público**: Los clientes pueden rastrear el estado de su reparación con el número de ticket
- ✅ **Dashboard Completo**: Panel de control con estadísticas y vista de todas las reparaciones
- ✅ **Búsqueda y Filtrado**: Búsqueda avanzada y filtros por estado, marca, modelo, etc.
- ✅ **Validación Robusta**: Validación de formularios con Zod y react-hook-form
- ✅ **Manejo de Errores**: Error boundaries y logging estructurado de errores
- ✅ **Accesibilidad**: Componentes accesibles con ARIA labels y navegación por teclado

## Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **UI**: React, Tailwind CSS, shadcn/ui
- **Validación**: Zod, react-hook-form
- **Notificaciones**: Sonner (toast notifications)
- **Email**: Resend
- **TypeScript**: Tipado completo

## Requisitos Previos

- Node.js 18+ 
- pnpm (o npm/yarn)
- Cuenta de Supabase
- Cuenta de Resend (para envío de emails)

## Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd computer-repair-platform
```

2. Instala las dependencias:
```bash
pnpm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env.local
```

4. Completa las variables de entorno en `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
RESEND_API_KEY=tu_api_key_de_resend
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

5. Ejecuta las migraciones de la base de datos:
   - Ejecuta los scripts SQL en el orden indicado en la carpeta `scripts/`:
     - `001_create_tables.sql`
     - `002_create_profile_trigger.sql`
     - `003_add_ticket_system.sql`

6. Inicia el servidor de desarrollo:
```bash
pnpm dev
```

7. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
├── app/                    # Rutas de Next.js (App Router)
│   ├── api/               # API routes
│   ├── auth/              # Páginas de autenticación
│   ├── dashboard/         # Panel de control
│   └── track/             # Página pública de rastreo
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI (shadcn/ui)
│   └── ...               # Componentes específicos
├── lib/                   # Utilidades y helpers
│   ├── supabase/         # Clientes de Supabase
│   ├── schemas.ts        # Schemas de validación Zod
│   ├── env.ts            # Validación de variables de entorno
│   └── error-handler.ts  # Utilidades de manejo de errores
├── types/                 # Tipos TypeScript
├── scripts/               # Scripts SQL de migración
└── public/               # Archivos estáticos
```

## Base de Datos

### Tablas Principales

- **profiles**: Información de usuarios
- **computers**: Registro de computadoras en reparación
- **notifications**: Notificaciones del sistema

### Estados de Reparación

- `pending`: Pendiente de revisión
- `in_progress`: En proceso de reparación
- `needs_repair`: Necesita reparación
- `completed`: Completada

## Desarrollo

### Scripts Disponibles

```bash
pnpm dev          # Inicia el servidor de desarrollo
pnpm build        # Construye la aplicación para producción
pnpm start        # Inicia el servidor de producción
pnpm lint         # Ejecuta el linter
```

### Validación de Formularios

Todos los formularios utilizan Zod para validación. Los schemas están definidos en `lib/schemas.ts`.

### Manejo de Errores

- Error boundaries en componentes críticos
- Logging estructurado de errores
- Mensajes de error amigables para usuarios
- Utilidades centralizadas en `lib/error-handler.ts`

### Variables de Entorno

Las variables de entorno se validan automáticamente al inicio usando Zod. Ver `lib/env.ts` para más detalles.

## Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. Vercel detectará automáticamente Next.js y desplegará

### Otros Proveedores

El proyecto es compatible con cualquier plataforma que soporte Next.js:
- Netlify
- Railway
- AWS Amplify
- etc.

## Seguridad

- Row Level Security (RLS) habilitado en Supabase
- Validación de entrada en todos los formularios
- Validación de API con Zod
- Sanitización de inputs
- Autenticación con Supabase Auth

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.

## Soporte

Para soporte, abre un issue en el repositorio o contacta al equipo de desarrollo.

