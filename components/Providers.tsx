"use client"
import type React from "react"

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return <>{children}</>
}
