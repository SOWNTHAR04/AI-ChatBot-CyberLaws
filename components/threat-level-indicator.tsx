"use client"
import { AlertTriangle, Shield, Zap } from "lucide-react"

interface ThreatLevelIndicatorProps {
  level: string
}

export function ThreatLevelIndicator({ level }: ThreatLevelIndicatorProps) {
  const getLevelConfig = (level: string) => {
    switch (level) {
      case "LOW":
        return {
          color: "bg-green-500",
          textColor: "text-green-700",
          bgColor: "bg-green-50",
          icon: Shield,
          pulse: false,
        }
      case "MODERATE":
        return {
          color: "bg-yellow-500",
          textColor: "text-yellow-700",
          bgColor: "bg-yellow-50",
          icon: AlertTriangle,
          pulse: false,
        }
      case "HIGH":
        return {
          color: "bg-red-500",
          textColor: "text-red-700",
          bgColor: "bg-red-50",
          icon: Zap,
          pulse: true,
        }
      default:
        return {
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
          icon: Shield,
          pulse: false,
        }
    }
  }

  const config = getLevelConfig(level)
  const Icon = config.icon

  return (
    <div className={`flex items-center space-x-2 p-3 rounded-lg ${config.bgColor} border`}>
      <div className={`w-3 h-3 rounded-full ${config.color} ${config.pulse ? "animate-pulse" : ""}`}></div>
      <Icon className={`h-5 w-5 ${config.textColor}`} />
      <span className={`font-semibold ${config.textColor}`}>Threat Level: {level}</span>
    </div>
  )
}
