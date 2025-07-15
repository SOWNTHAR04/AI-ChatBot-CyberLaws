"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Users, GraduationCap, HelpCircle } from "lucide-react"

interface ConversationModeSelectorProps {
  currentMode: string
  onModeChange: (mode: string) => void
}

export function ConversationModeSelector({ currentMode, onModeChange }: ConversationModeSelectorProps) {
  const modes = [
    {
      id: "assistance",
      title: "Victim Assistance",
      description: "AI guides victims through reporting process",
      icon: HelpCircle,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      id: "simulation",
      title: "Training Simulation",
      description: "AI role-plays as victim for officer training",
      icon: Users,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
    },
    {
      id: "interview",
      title: "Interview Practice",
      description: "Practice victim interview techniques",
      icon: MessageSquare,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      id: "education",
      title: "Legal Education",
      description: "Learn about cyber laws and procedures",
      icon: GraduationCap,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {modes.map((mode) => {
        const Icon = mode.icon
        const isActive = currentMode === mode.id

        return (
          <Card
            key={mode.id}
            className={`
              cursor-pointer transition-all duration-300 hover:shadow-lg
              ${isActive ? `${mode.bgColor} border-2 scale-105 shadow-lg` : "hover:scale-102"}
            `}
            onClick={() => onModeChange(mode.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Icon className={`h-5 w-5 ${isActive ? mode.textColor : "text-gray-600"}`} />
                  <span className={isActive ? mode.textColor : "text-gray-800"}>{mode.title}</span>
                </div>
                {isActive && <Badge className={mode.color}>Active</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className={`text-xs ${isActive ? mode.textColor : "text-gray-600"}`}>{mode.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
