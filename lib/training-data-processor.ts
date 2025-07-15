import { CYBER_LAWS_DATABASE, INCIDENT_DATABASE } from "./cyber-laws-database"

export interface TrainingDataPoint {
  input: string
  output: string
  context: {
    country: string
    lawType: string
    incidentType?: string
    severity?: string
  }
  metadata: {
    jurisdiction: string
    lastUpdated: string
    sources: string[]
  }
}

export class TrainingDataProcessor {
  private trainingData: TrainingDataPoint[] = []

  generateTrainingData(): TrainingDataPoint[] {
    this.trainingData = []

    // Generate law-based training data
    this.generateLawBasedData()

    // Generate incident-based training data
    this.generateIncidentBasedData()

    // Generate cross-jurisdictional comparisons
    this.generateComparativeData()

    // Generate victim guidance data
    this.generateVictimGuidanceData()

    return this.trainingData
  }

  private generateLawBasedData() {
    Object.entries(CYBER_LAWS_DATABASE).forEach(([countryCode, laws]) => {
      laws.forEach((law) => {
        // Basic law information
        this.trainingData.push({
          input: `What are the cyber laws in ${law.country}?`,
          output: `The primary cyber law in ${law.country} is the ${law.title}. ${law.description}. It covers various sections including ${law.sections.map((s) => s.title).join(", ")}.`,
          context: {
            country: law.country,
            lawType: "overview",
          },
          metadata: {
            jurisdiction: law.jurisdiction,
            lastUpdated: law.lastUpdated,
            sources: [law.id],
          },
        })

        // Section-specific data
        law.sections.forEach((section) => {
          this.trainingData.push({
            input: `What does Section ${section.section} of ${law.title} cover?`,
            output: `Section ${section.section} titled "${section.title}" covers ${section.description}. It applies to offenses such as ${section.applicableOffenses.join(", ")}. Examples include: ${section.examples.join(", ")}.`,
            context: {
              country: law.country,
              lawType: "section-specific",
            },
            metadata: {
              jurisdiction: law.jurisdiction,
              lastUpdated: law.lastUpdated,
              sources: [law.id],
            },
          })
        })

        // Penalty information
        law.penalties.forEach((penalty) => {
          this.trainingData.push({
            input: `What are the penalties for ${penalty.offense} in ${law.country}?`,
            output: `For ${penalty.offense} in ${law.country}, the penalties include imprisonment of ${penalty.imprisonment} and fines ranging from ${penalty.minPenalty} to ${penalty.maxPenalty}.`,
            context: {
              country: law.country,
              lawType: "penalties",
            },
            metadata: {
              jurisdiction: law.jurisdiction,
              lastUpdated: law.lastUpdated,
              sources: [law.id],
            },
          })
        })
      })
    })
  }

  private generateIncidentBasedData() {
    INCIDENT_DATABASE.forEach((incident) => {
      this.trainingData.push({
        input: `Tell me about a ${incident.type} case in ${incident.country}`,
        output: `In ${incident.country}, there was a ${incident.severity.toLowerCase()} severity ${incident.type} incident: ${incident.description}. It affected the ${incident.affectedSectors.join(" and ")} sectors. Legal actions taken included: ${incident.legalActions.join(", ")}. The applicable laws were: ${incident.applicableLaws.join(", ")}.`,
        context: {
          country: incident.country,
          lawType: "case-study",
          incidentType: incident.type,
          severity: incident.severity,
        },
        metadata: {
          jurisdiction: incident.country,
          lastUpdated: incident.reportedDate,
          sources: incident.applicableLaws,
        },
      })

      // Generate victim guidance based on incidents
      this.trainingData.push({
        input: `I'm a victim of ${incident.type} in ${incident.country}, what should I do?`,
        output: `As a victim of ${incident.type} in ${incident.country}, you should: 1) Immediately preserve all evidence, 2) Report to local cyber crime authorities, 3) The applicable laws that protect you include ${incident.applicableLaws.join(" and ")}, 4) Document all damages and communications, 5) Consider legal action under the relevant cyber crime laws.`,
        context: {
          country: incident.country,
          lawType: "victim-guidance",
          incidentType: incident.type,
          severity: incident.severity,
        },
        metadata: {
          jurisdiction: incident.country,
          lastUpdated: incident.reportedDate,
          sources: incident.applicableLaws,
        },
      })
    })
  }

  private generateComparativeData() {
    const countries = Object.keys(CYBER_LAWS_DATABASE)

    // Compare laws between countries
    for (let i = 0; i < countries.length; i++) {
      for (let j = i + 1; j < countries.length; j++) {
        const country1 = countries[i]
        const country2 = countries[j]
        const laws1 = CYBER_LAWS_DATABASE[country1]
        const laws2 = CYBER_LAWS_DATABASE[country2]

        this.trainingData.push({
          input: `Compare cyber laws between ${laws1[0].country} and ${laws2[0].country}`,
          output: `${laws1[0].country} has ${laws1[0].title} while ${laws2[0].country} has ${laws2[0].title}. ${laws1[0].country} focuses on ${laws1[0].sections
            .map((s) => s.title)
            .slice(0, 2)
            .join(" and ")}, whereas ${laws2[0].country} emphasizes ${laws2[0].sections
            .map((s) => s.title)
            .slice(0, 2)
            .join(" and ")}.`,
          context: {
            country: "comparative",
            lawType: "comparison",
          },
          metadata: {
            jurisdiction: "multi-jurisdictional",
            lastUpdated: new Date().toISOString().split("T")[0],
            sources: [laws1[0].id, laws2[0].id],
          },
        })
      }
    }
  }

  private generateVictimGuidanceData() {
    const commonCrimes = ["Phishing", "Ransomware", "Identity Theft", "Cyberbullying", "Online Fraud"]

    Object.entries(CYBER_LAWS_DATABASE).forEach(([countryCode, laws]) => {
      commonCrimes.forEach((crime) => {
        const relevantSections = laws[0].sections.filter((section) =>
          section.applicableOffenses.some(
            (offense) =>
              offense.toLowerCase().includes(crime.toLowerCase()) ||
              crime.toLowerCase().includes(offense.toLowerCase()),
          ),
        )

        if (relevantSections.length > 0) {
          this.trainingData.push({
            input: `I'm a victim of ${crime} in ${laws[0].country}, what legal protections do I have?`,
            output: `As a victim of ${crime} in ${laws[0].country}, you are protected under ${laws[0].title}. Specifically, ${relevantSections.map((s) => `Section ${s.section} (${s.title})`).join(" and ")} apply to your case. You should report this to cyber crime authorities immediately and preserve all evidence including screenshots, emails, and transaction records.`,
            context: {
              country: laws[0].country,
              lawType: "victim-protection",
              incidentType: crime,
            },
            metadata: {
              jurisdiction: laws[0].jurisdiction,
              lastUpdated: laws[0].lastUpdated,
              sources: [laws[0].id],
            },
          })
        }
      })
    })
  }

  exportTrainingData(): string {
    return JSON.stringify(this.trainingData, null, 2)
  }

  getTrainingStats() {
    const stats = {
      totalDataPoints: this.trainingData.length,
      byCountry: {} as Record<string, number>,
      byLawType: {} as Record<string, number>,
      byIncidentType: {} as Record<string, number>,
    }

    this.trainingData.forEach((point) => {
      // Count by country
      stats.byCountry[point.context.country] = (stats.byCountry[point.context.country] || 0) + 1

      // Count by law type
      stats.byLawType[point.context.lawType] = (stats.byLawType[point.context.lawType] || 0) + 1

      // Count by incident type
      if (point.context.incidentType) {
        stats.byIncidentType[point.context.incidentType] = (stats.byIncidentType[point.context.incidentType] || 0) + 1
      }
    })

    return stats
  }
}
