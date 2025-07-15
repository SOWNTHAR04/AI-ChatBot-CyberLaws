"use client"

import { User, Bot, Shield, HelpCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface RoleIndicatorProps {
  role: "assistant" | "victim" | "officer" | "system"
  isActive?: boolean
}

export function RoleIndicator({ role, isActive = false }: RoleIndicatorProps) {
  const getRoleConfig = (role: string) => {
    switch (role) {
      case "assistant":
        return {
          icon: Bot,
          label: "AI Assistant",
          color: "bg-blue-500",
          textColor: "text-blue-700",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        }
      case "victim":
        return {
          icon: HelpCircle,
          label: "Victim Simulation",
          color: "bg-red-500",
          textColor: "text-red-700",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        }
      case "officer":
        return {
          icon: Shield,
          label: "Law Enforcement",
          color: "bg-green-500",
          textColor: "text-green-700",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        }
      case "system":
        return {
          icon: User,
          label: "System",
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        }
      default:
        return {
          icon: Bot,
          label: "Assistant",
          color: "bg-blue-500",
          textColor: "text-blue-700",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        }
    }
  }

  const config = getRoleConfig(role)
  const Icon = config.icon

  return (
    <Badge
      className={`
        flex items-center space-x-2 px-3 py-1 transition-all duration-300
        ${config.bgColor} ${config.textColor} ${config.borderColor} border
        ${isActive ? "animate-pulse scale-105 shadow-lg" : ""}
      `}
    >
      <div className={`w-2 h-2 rounded-full ${config.color} ${isActive ? "animate-ping" : ""}`}></div>
      <Icon className="h-4 w-4" />
      <span className="font-medium">{config.label}</span>
    </Badge>
  )
}
