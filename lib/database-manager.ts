import { supabase } from "./supabase"
import { CISADataCollector } from "./data-collectors/cisa-collector"
import { CyberLawCollector } from "./data-collectors/cyber-law-collector"

export class DatabaseManager {
  private cisaCollector = new CISADataCollector()
  private lawCollector = new CyberLawCollector()

  async initializeDatabase() {
    try {
      // Create tables if they don't exist
      await this.createTables()

      // Populate with initial data
      await this.populateInitialData()

      return { success: true, message: "Database initialized successfully" }
    } catch (error) {
      console.error("Database initialization error:", error)
      return { success: false, error: error.message }
    }
  }

  private async createTables() {
    // Tables are created via Supabase SQL editor or migrations
    // This is a placeholder for table creation logic
    console.log("Tables should be created via Supabase dashboard")
  }

  async populateInitialData() {
    try {
      // Collect and store CISA alerts
      const cisaAlerts = await this.cisaCollector.collectAlerts()
      for (const alert of cisaAlerts) {
        await supabase.from("cisa_alerts").upsert({
          alert_id: alert.alert_id,
          title: alert.title,
          severity: alert.severity,
          description: alert.description,
          affected_sectors: alert.affected_sectors,
          published_date: alert.published_date,
          updated_date: alert.updated_date,
          source_url: alert.source_url,
        })
      }

      // Collect and store cyber laws
      const cyberLaws = await this.lawCollector.collectGlobalCyberLaws()
      for (const law of cyberLaws) {
        await supabase.from("cyber_laws").upsert({
          id: `${law.country.toLowerCase().replace(" ", "_")}_${Date.now()}`,
          country: law.country,
          title: law.title,
          description: law.description,
          sections: law.sections,
          penalties: law.penalties,
          last_updated: law.last_updated,
          jurisdiction: law.jurisdiction,
        })
      }

      // Collect and store incident data
      const incidents = await this.lawCollector.collectIncidentData()
      for (const incident of incidents) {
        await supabase.from("cyber_incidents").upsert({
          id: `${incident.country.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          country: incident.country,
          incident_type: incident.incident_type,
          severity: incident.severity,
          description: incident.description,
          affected_sectors: incident.affected_sectors,
          reported_date: incident.reported_date,
          resolved_date: incident.resolved_date,
          legal_actions: incident.legal_actions,
          applicable_laws: incident.applicable_laws,
          source: incident.source,
        })
      }

      return { success: true, message: "Initial data populated successfully" }
    } catch (error) {
      console.error("Error populating initial data:", error)
      throw error
    }
  }

  async getCyberLaws(country?: string) {
    let query = supabase.from("cyber_laws").select("*")

    if (country && country !== "global") {
      query = query.eq("country", country)
    }

    const { data, error } = await query

    if (error) {
      // table not found → return empty list instead of crashing
      if (error.code === "42P01") {
        console.warn(`Supabase table missing: ${error.message}`)
        return []
      }
      throw error
    }
    return data
  }

  async getCyberIncidents(country?: string) {
    let query = supabase.from("cyber_incidents").select("*")

    if (country && country !== "global") {
      query = query.eq("country", country)
    }

    const { data, error } = await query.order("reported_date", { ascending: false })

    if (error) {
      // table not found → return empty list instead of crashing
      if (error.code === "42P01") {
        console.warn(`Supabase table missing: ${error.message}`)
        return []
      }
      throw error
    }
    return data
  }

  async getCisaAlerts() {
    const { data, error } = await supabase.from("cisa_alerts").select("*").order("published_date", { ascending: false })

    if (error) {
      // table not found → return empty list instead of crashing
      if (error.code === "42P01") {
        console.warn(`Supabase table missing: ${error.message}`)
        return []
      }
      throw error
    }
    return data
  }

  async generateTrainingData() {
    try {
      const laws = await this.getCyberLaws()
      const incidents = await this.getCyberIncidents()
      const trainingData = []

      // Generate training data from laws
      for (const law of laws) {
        // Basic law information
        trainingData.push({
          input_text: `What are the cyber laws in ${law.country}?`,
          output_text: `The primary cyber law in ${law.country} is the ${law.title}. ${law.description}. It covers various sections including ${law.sections?.map((s) => s.title).join(", ")}.`,
          context: {
            country: law.country,
            law_type: "overview",
            jurisdiction: law.jurisdiction,
          },
          metadata: {
            source: "cyber_laws_database",
            last_updated: law.last_updated,
            law_id: law.id,
          },
        })

        // Section-specific data
        if (law.sections) {
          for (const section of law.sections) {
            trainingData.push({
              input_text: `What does Section ${section.section} of ${law.title} cover?`,
              output_text: `Section ${section.section} titled "${section.title}" covers ${section.description}. It applies to offenses such as ${section.applicable_offenses?.join(", ")}. Examples include: ${section.examples?.join(", ")}.`,
              context: {
                country: law.country,
                law_type: "section_specific",
                section: section.section,
              },
              metadata: {
                source: "cyber_laws_database",
                law_id: law.id,
                section_id: section.section,
              },
            })
          }
        }

        // Penalty information
        if (law.penalties) {
          for (const penalty of law.penalties) {
            trainingData.push({
              input_text: `What are the penalties for ${penalty.offense} in ${law.country}?`,
              output_text: `For ${penalty.offense} in ${law.country}, the penalties include imprisonment of ${penalty.imprisonment} and fines ranging from ${penalty.min_penalty} to ${penalty.max_penalty}.`,
              context: {
                country: law.country,
                law_type: "penalties",
                offense: penalty.offense,
              },
              metadata: {
                source: "cyber_laws_database",
                law_id: law.id,
              },
            })
          }
        }
      }

      // Generate training data from incidents
      for (const incident of incidents) {
        trainingData.push({
          input_text: `Tell me about a ${incident.incident_type} case in ${incident.country}`,
          output_text: `In ${incident.country}, there was a ${incident.severity.toLowerCase()} severity ${incident.incident_type} incident: ${incident.description}. It affected the ${incident.affected_sectors?.join(" and ")} sectors. Legal actions taken included: ${incident.legal_actions?.join(", ")}. The applicable laws were: ${incident.applicable_laws?.join(", ")}.`,
          context: {
            country: incident.country,
            law_type: "case_study",
            incident_type: incident.incident_type,
            severity: incident.severity,
          },
          metadata: {
            source: "cyber_incidents_database",
            incident_id: incident.id,
            reported_date: incident.reported_date,
          },
        })

        // Generate victim guidance
        trainingData.push({
          input_text: `I'm a victim of ${incident.incident_type} in ${incident.country}, what should I do?`,
          output_text: `As a victim of ${incident.incident_type} in ${incident.country}, you should: 1) Immediately preserve all evidence, 2) Report to local cyber crime authorities, 3) The applicable laws that protect you include ${incident.applicable_laws?.join(" and ")}, 4) Document all damages and communications, 5) Consider legal action under the relevant cyber crime laws.`,
          context: {
            country: incident.country,
            law_type: "victim_guidance",
            incident_type: incident.incident_type,
          },
          metadata: {
            source: "cyber_incidents_database",
            incident_id: incident.id,
          },
        })
      }

      // Store training data in database
      for (const data of trainingData) {
        await supabase.from("training_data").upsert({
          input_text: data.input_text,
          output_text: data.output_text,
          context: data.context,
          metadata: data.metadata,
        })
      }

      return {
        success: true,
        count: trainingData.length,
        data: trainingData,
      }
    } catch (error) {
      console.error("Error generating training data:", error)
      return { success: false, error: error.message }
    }
  }

  async getTrainingData() {
    const { data, error } = await supabase.from("training_data").select("*").order("created_at", { ascending: false })

    if (error) {
      // table not found → return empty list instead of crashing
      if (error.code === "42P01") {
        console.warn(`Supabase table missing: ${error.message}`)
        return []
      }
      throw error
    }
    return data
  }
}
