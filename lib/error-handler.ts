/**
 * Centralized error handling utilities
 */

export interface AppError {
  message: string
  code?: string
  statusCode?: number
  details?: unknown
}

/**
 * Formats an error into a user-friendly message
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === "string") {
    return error
  }

  if (error && typeof error === "object" && "message" in error) {
    return String(error.message)
  }

  return "Ocurrió un error inesperado. Por favor intenta de nuevo."
}

/**
 * Logs an error with structured information
 */
export function logError(error: unknown, context?: Record<string, unknown>) {
  const errorInfo: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    error: formatError(error),
    ...context,
  }

  if (error instanceof Error) {
    errorInfo.stack = error.stack
    errorInfo.name = error.name
  }

  // In development, log to console
  if (process.env.NODE_ENV === "development") {
    console.error("Error logged:", errorInfo)
  }

  // In production, you could send this to an error reporting service
  // Example: sendToErrorReportingService(errorInfo)
}

/**
 * Creates a standardized error object
 */
export function createAppError(
  message: string,
  code?: string,
  statusCode?: number,
  details?: unknown,
): AppError {
  return {
    message,
    code,
    statusCode,
    details,
  }
}

/**
 * Handles Supabase errors
 */
export function handleSupabaseError(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    const supabaseError = error as { message: string; code?: string }
    
    // Map common Supabase error codes to user-friendly messages
    const errorMessages: Record<string, string> = {
      "23505": "Este registro ya existe",
      "23503": "No se puede eliminar porque tiene registros relacionados",
      "PGRST116": "No se encontró el registro solicitado",
    }

    if (supabaseError.code && errorMessages[supabaseError.code]) {
      return errorMessages[supabaseError.code]
    }

    return supabaseError.message
  }

  return formatError(error)
}


