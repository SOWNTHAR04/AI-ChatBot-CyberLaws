import { NextResponse } from "next/server"
import { DatabaseManager } from "@/lib/database-manager"

export async function GET() {
  try {
    const dbManager = new DatabaseManager()
    const trainingData = await dbManager.getTrainingData()

    const stats = {
      totalDataPoints: trainingData.length,
      byCountry: {},
      byLawType: {},
      byIncidentType: {},
    }

    trainingData.forEach((point) => {
      const country = point.context?.country || "unknown"
      const lawType = point.context?.law_type || "unknown"
      const incidentType = point.context?.incident_type

      stats.byCountry[country] = (stats.byCountry[country] || 0) + 1
      stats.byLawType[lawType] = (stats.byLawType[lawType] || 0) + 1

      if (incidentType) {
        stats.byIncidentType[incidentType] = (stats.byIncidentType[incidentType] || 0) + 1
      }
    })

    return NextResponse.json({
      success: true,
      data: trainingData,
      stats: stats,
      message: `Retrieved ${trainingData.length} training data points`,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { action } = await req.json()
    const dbManager = new DatabaseManager()

    if (action === "generate") {
      const result = await dbManager.generateTrainingData()
      return NextResponse.json(result)
    }

    if (action === "export") {
      const trainingData = await dbManager.getTrainingData()
      const exportData = JSON.stringify(trainingData, null, 2)

      return new NextResponse(exportData, {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": 'attachment; filename="cyber-law-training-data.json"',
        },
      })
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
