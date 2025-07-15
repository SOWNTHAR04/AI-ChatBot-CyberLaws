import { groq } from "@ai-sdk/groq" // Using Groq provider
import { streamText } from "ai"
import { DatabaseManager } from "@/lib/database-manager"
import { NextResponse } from "next/server"

export const maxDuration = 60

export async function POST(req: Request) {
  const { messages, mode = "assistance", country = "global" } = await req.json()

  try {
    // IMPORTANT: Check for the GROQ_API_KEY since we are using the Groq model
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not set in environment variables.")
      return NextResponse.json(
        {
          success: false,
          error:
            "Groq API key is not configured. Please set GROQ_API_KEY in your Vercel project environment variables.",
        },
        { status: 400 },
      )
    }

    const dbManager = new DatabaseManager()

    // Get relevant data from database
    const cyberLaws = await dbManager.getCyberLaws(country !== "global" ? country : undefined)
    const incidents = await dbManager.getCyberIncidents(country !== "global" ? country : undefined)
    const cisaAlerts = await dbManager.getCisaAlerts()

    const getEnhancedSystemPrompt = (mode: string, country: string) => {
      const lawsContext =
        cyberLaws.length > 0
          ? `\n\nRELEVANT CYBER LAWS:\n${JSON.stringify(cyberLaws.slice(0, 5), null, 2)}`
          : "\n\nNo specific cyber laws found in database."

      const incidentsContext =
        incidents.length > 0
          ? `\n\nRECENT CYBER INCIDENTS:\n${JSON.stringify(incidents.slice(0, 10), null, 2)}`
          : "\n\nNo recent incidents found in database."

      const cisaContext =
        cisaAlerts.length > 0
          ? `\n\nCISA SECURITY ALERTS:\n${JSON.stringify(cisaAlerts.slice(0, 5), null, 2)}`
          : "\n\nNo CISA alerts available."

      const basePrompt = getSystemPrompt(mode)

      return `${basePrompt}

${lawsContext}

${incidentsContext}

${cisaContext}

IMPORTANT INSTRUCTIONS:
1. Always reference specific laws and sections when providing legal advice
2. Mention relevant case studies from the incidents database when applicable
3. Provide country-specific guidance based on the user's jurisdiction
4. If asked about multiple countries, compare their cyber laws
5. Always include penalties and legal consequences
6. Provide practical steps for victims based on their country's legal framework
7. Reference recent incidents and CISA alerts to provide context and examples
8. Use the database information to provide accurate, up-to-date guidance

When responding, always consider:
- The specific country's legal framework from the database
- Recent incidents and case studies from the database
- Current CISA alerts and vulnerabilities
- Applicable penalties and consequences
- Practical steps for victims
- Cross-jurisdictional considerations if relevant`
    }

    const getSystemPrompt = (mode: string) => {
      switch (mode) {
        case "assistance":
          return `You are a specialized AI assistant helping cyber crime victims with comprehensive knowledge of cyber laws from multiple countries stored in a live database. Your role is to:

1. Provide country-specific legal guidance based on the victim's jurisdiction using database information
2. Reference specific cyber laws, sections, and penalties from the database
3. Guide victims through the reporting process according to their country's procedures
4. Provide examples from recent cyber incidents stored in the database
5. Reference current CISA alerts and security advisories
6. Explain legal procedures and victim rights in simple terms
7. Help identify the type of cyber attack and applicable laws

Always be empathetic, professional, and thorough. Use the provided database information to give accurate, jurisdiction-specific advice.

Respond with: ROLE:assistant`

        case "simulation":
          return `You are role-playing as a cyber crime victim for law enforcement training, with knowledge of real cyber incidents from the database. Your role is to:

1. Act as a realistic victim based on actual case studies from the incidents database
2. Reference real cyber laws and legal frameworks from the database
3. Respond emotionally and realistically based on actual victim experiences
4. Provide details gradually as documented in real cases from the database
5. Show appropriate levels of distress based on incident severity from database records.
6. **Always provide a response, even if it's a short one, to simulate a conversation.**
7. **Do not remain silent or provide empty responses.**

Use the database information to create realistic scenarios and reference actual legal frameworks.

Respond with: ROLE:victim`

        case "interview":
          return `You are an AI assistant helping law enforcement officers practice victim interview techniques with knowledge of multi-jurisdictional cyber laws from the database. Your role is to:

1. Provide guidance on proper questioning techniques for different types of cyber crimes
2. Reference specific legal requirements from different countries using database information
3. Suggest follow-up questions based on applicable laws and recent case studies from the database
4. Point out jurisdictional considerations and cross-border legal issues
5. Help maintain professional and empathetic communication
6. Reference current CISA alerts for context

Use the database information to provide comprehensive training guidance.

Respond with: ROLE:officer`

        case "education":
          return `You are a cyber law education specialist with comprehensive knowledge of cyber laws from the database covering multiple countries. Your role is to:

1. Explain cyber laws and regulations from multiple jurisdictions using database information
2. Provide comparative analysis of different countries' legal frameworks from the database
3. Use real case studies and incidents from the database to illustrate legal concepts
4. Discuss recent developments and amendments in cyber law
5. Reference current CISA alerts and security advisories
6. Help understand international cooperation in cyber crime cases

Be educational, accurate, and comprehensive using the provided database information.

Respond with: ROLE:assistant`

        default:
          return `You are a comprehensive cyber law assistant with access to a live database of cyber laws from multiple countries and recent cyber incident data.

Respond with: ROLE:assistant`
      }
    }

    // Use the Groq model with llama3-8b-8192
    const result = await streamText({
      model: groq("llama3-8b-8192"), // Using Groq's Llama 3.1 8B model [^2][^3]
      system: getEnhancedSystemPrompt(mode, country),
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)

    // Fallback response without database
    const result = streamText({
      model: groq("llama3-8b-8192"), // Fallback also uses Groq's Llama 3.1 8B model
      system: `You are a cyber law assistant. I apologize, but I'm currently unable to access the latest database information. I can still help with general cyber law questions based on my training data.`,
      messages,
    })

    return result.toDataStreamResponse()
  }
}
