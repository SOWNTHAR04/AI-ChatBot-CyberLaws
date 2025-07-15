import { NextResponse } from "next/server"

export async function GET() {
  // Simulated real-time threat intelligence
  const threatData = {
    trends: [
      {
        type: "Ransomware",
        current: Math.floor(Math.random() * 30) + 70,
        change: Math.floor(Math.random() * 20) + 5,
        direction: "up",
      },
      {
        type: "Phishing",
        current: Math.floor(Math.random() * 25) + 55,
        change: Math.floor(Math.random() * 15) + 3,
        direction: "up",
      },
      {
        type: "DDoS",
        current: Math.floor(Math.random() * 20) + 35,
        change: Math.floor(Math.random() * 10) + 2,
        direction: "down",
      },
      {
        type: "Data Breach",
        current: Math.floor(Math.random() * 35) + 80,
        change: Math.floor(Math.random() * 25) + 10,
        direction: "up",
      },
    ],
    recentIncidents: [
      {
        id: "INC-2024-001",
        type: "Ransomware",
        target: "Healthcare Network",
        severity: "Critical",
        timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        location: "North America",
      },
      {
        id: "INC-2024-002",
        type: "Phishing",
        target: "Financial Institution",
        severity: "High",
        timestamp: new Date(Date.now() - Math.random() * 7200000).toISOString(),
        location: "Europe",
      },
    ],
  }

  return NextResponse.json(threatData)
}
