"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Database, Download, RefreshCw, BarChart3, FileText } from "lucide-react"
import { AnimatedCounter } from "./animated-counter"

export function TrainingDashboard() {
  const [trainingStats, setTrainingStats] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const fetchTrainingStats = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/training-data")
      const data = await response.json()
      setTrainingStats(data.stats)
    } catch (error) {
      console.error("Failed to fetch training stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateTrainingData = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/training-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ export: false }),
      })
      const data = await response.json()
      if (data.success) {
        await fetchTrainingStats()
      }
    } catch (error) {
      console.error("Failed to generate training data:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const exportTrainingData = async () => {
    try {
      const response = await fetch("/api/training-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ export: true }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "cyber-law-training-data.json"
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Failed to export training data:", error)
    }
  }

  useEffect(() => {
    fetchTrainingStats()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Database className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Training Data Management</h2>
        </div>
        <div className="flex space-x-2">
          <Button onClick={generateTrainingData} disabled={isGenerating} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
            {isGenerating ? "Generating..." : "Generate Data"}
          </Button>
          <Button onClick={exportTrainingData} disabled={!trainingStats}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : trainingStats ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Data Points</p>
                    <p className="text-3xl font-bold text-blue-600">
                      <AnimatedCounter end={trainingStats.totalDataPoints} />
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Countries Covered</p>
                    <p className="text-3xl font-bold text-green-600">
                      <AnimatedCounter end={Object.keys(trainingStats.byCountry).length} />
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Law Types</p>
                    <p className="text-3xl font-bold text-purple-600">
                      <AnimatedCounter end={Object.keys(trainingStats.byLawType).length} />
                    </p>
                  </div>
                  <Database className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Distribution by Country</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {Object.entries(trainingStats.byCountry).map(([country, count]) => (
                      <div key={country} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{country}</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={(count / trainingStats.totalDataPoints) * 100} className="w-24" />
                          <span className="text-sm font-medium w-12 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Distribution by Law Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {Object.entries(trainingStats.byLawType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="capitalize">
                            {type.replace("-", " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={(count / trainingStats.totalDataPoints) * 100} className="w-24" />
                          <span className="text-sm font-medium w-12 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {Object.keys(trainingStats.byIncidentType).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Incident Types Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(trainingStats.byIncidentType).map(([type, count]) => (
                    <div key={type} className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{count}</div>
                      <div className="text-sm text-gray-600">{type}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <Database className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">
              No training data available. Click "Generate Data" to create training dataset.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
