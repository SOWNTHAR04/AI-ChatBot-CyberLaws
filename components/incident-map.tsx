"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, MapPin } from "lucide-react"

export function IncidentMap() {
  const incidents = [
    { location: "North America", count: 89, severity: "HIGH" },
    { location: "Europe", count: 67, severity: "MEDIUM" },
    { location: "Asia Pacific", count: 134, severity: "HIGH" },
    { location: "South America", count: 23, severity: "LOW" },
    { location: "Africa", count: 45, severity: "MEDIUM" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="h-5 w-5 mr-2" />
          Global Incident Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {incidents.map((incident, index) => (
            <div
              key={incident.location}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{incident.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-600">{incident.count}</span>
                <Badge
                  variant={
                    incident.severity === "HIGH"
                      ? "destructive"
                      : incident.severity === "MEDIUM"
                        ? "default"
                        : "secondary"
                  }
                >
                  {incident.severity}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
