"use client"

import { useEffect, useState } from "react"
import { RoleIndicator } from "./role-indicator"

interface AnimatedMessageProps {
  message: {
    id: string
    role: string
    content: string
    messageRole?: "assistant" | "victim" | "officer" | "system"
  }
  index: number
}

export function AnimatedMessage({ message, index }: AnimatedMessageProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
      if (message.role === "assistant") {
        setIsTyping(true)
        setTimeout(() => setIsTyping(false), 1000)
      }
    }, index * 200)

    return () => clearTimeout(timer)
  }, [index, message.role])

  const getMessageStyle = (role: string, messageRole?: string) => {
    const baseStyle = "max-w-[80%] p-4 rounded-lg shadow-sm transition-all duration-500"

    if (role === "user") {
      return `${baseStyle} bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto`
    }

    switch (messageRole) {
      case "victim":
        return `${baseStyle} bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-200`
      case "officer":
        return `${baseStyle} bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200`
      case "system":
        return `${baseStyle} bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border border-gray-200`
      default:
        return `${baseStyle} bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200`
    }
  }

  return (
    <div
      className={`
        flex ${message.role === "user" ? "justify-end" : "justify-start"}
        transform transition-all duration-500 ease-out
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
      `}
    >
      <div className="flex flex-col space-y-2 max-w-[80%]">
        {message.role === "assistant" && message.messageRole && (
          <RoleIndicator role={message.messageRole} isActive={isTyping} />
        )}
        <div className={getMessageStyle(message.role, message.messageRole)}>
          <div className="whitespace-pre-wrap">
            {isTyping ? (
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="ml-2 text-sm opacity-70">Responding...</span>
              </div>
            ) : (
              message.content
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
