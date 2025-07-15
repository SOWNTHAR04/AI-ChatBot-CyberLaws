"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export function DatabaseStatus() {
  const [status, setStatus] = useState({
    connected: false,
    lastUpdated: null,
    recordCounts: {
      cyberLaws: 0,
      incidents: 0,
      cisaAlerts: 0,
      trainingData: 0,
    },
    isInitializing: false,
  })

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch("/api/training-data")
      const data = await response.json()

      if (data.success) {
        setStatus((prev) => ({
          ...prev,
          connected: true,
          lastUpdated: new Date().toISOString(),
          recordCounts: {
            cyberLaws: data.stats?.byCountry ? Object.values(data.stats.byCountry).reduce((a, b) => a + b, 0) : 0,
            incidents: data.stats?.byIncidentType
              ? Object.values(data.stats.byIncidentType).reduce((a, b) => a + b, 0)
              : 0,
            cisaAlerts: 0, // Would be populated from actual API
            trainingData: data.stats?.totalDataPoints || 0,
          },
        }))
      } else {
        setStatus((prev) => ({ ...prev, connected: false }))
      }
    } catch (error) {
      console.error("Database status check failed:", error)
      setStatus((prev) => ({ ...prev, connected: false }))
    }
  }

  const initializeDatabase = async () => {
    setStatus((prev) => ({ ...prev, isInitializing: true }))

    try {
      const response = await fetch("/api/database/init", {
        method: "POST",
      })
      const result = await response.json()

      if (result.success) {
        await checkDatabaseStatus()
      }
    } catch (error) {
      console.error("Database initialization failed:", error)
    } finally {
      setStatus((prev) => ({ ...prev, isInitializing: false }))
    }
  }

  useEffect(() => {
    checkDatabaseStatus()
    const interval = setInterval(checkDatabaseStatus, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Database Status
          </div>
          <div className="flex items-center space-x-2">
            {status.connected ? (
              <Badge className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="destructive">
                <XCircle className="h-3 w-3 mr-1" />
                Disconnected
              </Badge>
            )}
            <Button size="sm" variant="outline" onClick={checkDatabaseStatus} disabled={status.isInitializing}>
              <RefreshCw className={`h-4 w-4 ${status.isInitializing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{status.recordCounts.cyberLaws}</div>
              <div className="text-sm text-gray-600">Cyber Laws</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">{status.recordCounts.incidents}</div>
              <div className="text-sm text-gray-600">Incidents</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{status.recordCounts.cisaAlerts}</div>
              <div className="text-sm text-gray-600">CISA Alerts</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{status.recordCounts.trainingData}</div>
              <div className="text-sm text-gray-600">Training Data</div>
            </div>
          </div>

          {!status.connected && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <div>
                  <h4 className="font-medium text-yellow-800">Database Not Initialized</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Click the button below to initialize the database with cyber laws and incident data.
                  </p>
                </div>
              </div>
              <Button className="mt-3" onClick={initializeDatabase} disabled={status.isInitializing}>
                {status.isInitializing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  "Initialize Database"
                )}
              </Button>
            </div>
          )}

          {status.lastUpdated && (
            <div className="text-xs text-gray-500">Last updated: {new Date(status.lastUpdated).toLocaleString()}</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
