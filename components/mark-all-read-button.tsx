"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { CheckCheck } from "lucide-react"

export function MarkAllReadButton() {
  const router = useRouter()
  const supabase = createClient()
  const [isMarking, setIsMarking] = useState(false)

  const handleMarkAllRead = async () => {
    setIsMarking(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false)

      router.refresh()
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    } finally {
      setIsMarking(false)
    }
  }

  return (
    <Button onClick={handleMarkAllRead} disabled={isMarking} variant="outline" className="bg-transparent">
      <CheckCheck className="mr-2 h-4 w-4" />
      {isMarking ? "Marcando..." : "Marcar todas como leídas"}
    </Button>
  )
}
