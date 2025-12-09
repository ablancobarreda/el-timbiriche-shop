"use client"

import { FloatingWhatsApp } from "@dxkit-org/react-floating-whatsapp"
import "@dxkit-org/react-floating-whatsapp/dist/index.css"
import { usePathname } from "next/navigation"

interface WhatsAppButtonProps {
  phoneNumber?: string
  accountName?: string
  avatar?: string
  statusMessage?: string
  chatMessage?: string
  placeholder?: string
}

export function WhatsAppButton({ 
  phoneNumber = "5358583728", // +53 58583728 sin espacios ni caracteres especiales
  accountName = "El Timbiriche Shop",
  avatar = "/images/logo-bg-white.png",
  statusMessage = "Generalmente responde en 1 hora",
  chatMessage = "¡Hola! 👋 ¿Cómo podemos ayudarte?",
  placeholder = "Escribe un mensaje.."
}: WhatsAppButtonProps) {
  const pathname = usePathname()
  
  // Hide on admin routes
  if (pathname?.startsWith("/admin")) {
    return null
  }

  // Format phone number: remove all non-digit characters and ensure it starts with country code
  const formattedPhone = phoneNumber.replace(/\D/g, "")

  return (
    <FloatingWhatsApp
      phoneNumber={formattedPhone}
      accountName={accountName}
      avatar={avatar}
      statusMessage={statusMessage}
      chatMessage={chatMessage}
      placeholder={placeholder}
      darkMode={false}
      allowClickAway={false}
      allowEsc={true}
      style={{ bottom: "24px", right: "24px" }}
      chatboxHeight={320}
      notification={true}
      notificationDelay={60} // 60 seconds
      notificationSound={true}
      openChatOnClick={true}
      allowDefaultSubmit={true}
      buttonStyle={{ backgroundColor: "#f1839d" }}
    />
  )
}
