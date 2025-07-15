export interface CyberLaw {
  id: string
  country: string
  title: string
  description: string
  sections: CyberLawSection[]
  penalties: Penalty[]
  lastUpdated: string
  jurisdiction: string
}

export interface CyberLawSection {
  section: string
  title: string
  description: string
  applicableOffenses: string[]
  examples: string[]
}

export interface Penalty {
  offense: string
  minPenalty: string
  maxPenalty: string
  imprisonment: string
  fine: string
}

export interface CyberIncident {
  id: string
  country: string
  type: string
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  description: string
  affectedSectors: string[]
  reportedDate: string
  resolvedDate?: string
  legalActions: string[]
  applicableLaws: string[]
  caseStudy: boolean
}

export const CYBER_LAWS_DATABASE: Record<string, CyberLaw[]> = {
  india: [
    {
      id: "IT_ACT_2000",
      country: "India",
      title: "Information Technology Act, 2000 (Amended 2008)",
      description: "Primary legislation governing cyber crimes and electronic commerce in India",
      sections: [
        {
          section: "66",
          title: "Computer Related Offences",
          description: "Punishment for computer related offences including hacking",
          applicableOffenses: ["Hacking", "Data Theft", "System Damage"],
          examples: ["Unauthorized access to computer systems", "Data destruction", "Virus attacks"],
        },
        {
          section: "66A",
          title: "Offensive Messages (Struck Down)",
          description: "Previously covered sending offensive messages through communication service",
          applicableOffenses: ["Cyberbullying", "Online Harassment"],
          examples: ["Sending offensive messages", "Creating fake profiles"],
        },
        {
          section: "66B",
          title: "Identity Theft",
          description: "Punishment for dishonestly receiving stolen computer resource or communication device",
          applicableOffenses: ["Identity Theft", "Impersonation"],
          examples: ["Using someone else's digital identity", "Fraudulent use of electronic signatures"],
        },
        {
          section: "66C",
          title: "Identity Theft",
          description: "Punishment for identity theft",
          applicableOffenses: ["Identity Theft", "Impersonation"],
          examples: ["Using someone's password dishonestly", "Fraudulent use of electronic signatures"],
        },
        {
          section: "66D",
          title: "Cheating by Personation",
          description: "Punishment for cheating by personation by using computer resource",
          applicableOffenses: ["Online Fraud", "Impersonation"],
          examples: ["Cheating by impersonation using computer", "Fraudulent online transactions"],
        },
      ],
      penalties: [
        {
          offense: "Hacking (Section 66)",
          minPenalty: "₹1,00,000",
          maxPenalty: "₹5,00,000",
          imprisonment: "Up to 3 years",
          fine: "Up to ₹5,00,000",
        },
        {
          offense: "Identity Theft (Section 66C)",
          minPenalty: "₹1,00,000",
          maxPenalty: "₹1,00,000",
          imprisonment: "Up to 3 years",
          fine: "Up to ₹1,00,000",
        },
      ],
      lastUpdated: "2008-10-27",
      jurisdiction: "All of India",
    },
  ],
  usa: [
    {
      id: "CFAA_1986",
      country: "United States",
      title: "Computer Fraud and Abuse Act (CFAA)",
      description: "Federal law that criminalizes computer-related offenses",
      sections: [
        {
          section: "1030(a)(1)",
          title: "Classified Information",
          description: "Accessing classified information without authorization",
          applicableOffenses: ["Unauthorized Access", "Espionage"],
          examples: ["Accessing classified government data", "Military information theft"],
        },
        {
          section: "1030(a)(2)",
          title: "Financial Information",
          description: "Accessing financial records or credit information",
          applicableOffenses: ["Financial Fraud", "Identity Theft"],
          examples: ["Bank account hacking", "Credit card information theft"],
        },
        {
          section: "1030(a)(4)",
          title: "Fraud and Related Activity",
          description: "Using computers to commit fraud",
          applicableOffenses: ["Computer Fraud", "Wire Fraud"],
          examples: ["Online banking fraud", "E-commerce scams"],
        },
      ],
      penalties: [
        {
          offense: "First-time offender (1030(a)(2))",
          minPenalty: "$0",
          maxPenalty: "$250,000",
          imprisonment: "Up to 1 year",
          fine: "Up to $250,000",
        },
        {
          offense: "Repeat offender",
          minPenalty: "$0",
          maxPenalty: "$250,000",
          imprisonment: "Up to 10 years",
          fine: "Up to $250,000",
        },
      ],
      lastUpdated: "2008-05-07",
      jurisdiction: "Federal - All US States",
    },
  ],
  uk: [
    {
      id: "CMA_1990",
      country: "United Kingdom",
      title: "Computer Misuse Act 1990",
      description: "Primary legislation covering computer crimes in the UK",
      sections: [
        {
          section: "1",
          title: "Unauthorized Access",
          description: "Unauthorized access to computer material",
          applicableOffenses: ["Hacking", "Unauthorized Access"],
          examples: ["Password cracking", "System intrusion"],
        },
        {
          section: "2",
          title: "Unauthorized Access with Intent",
          description: "Unauthorized access with intent to commit further offences",
          applicableOffenses: ["Advanced Hacking", "Cyber Espionage"],
          examples: ["Hacking to commit fraud", "Corporate espionage"],
        },
        {
          section: "3",
          title: "Unauthorized Modification",
          description: "Unauthorized acts causing modification of computer material",
          applicableOffenses: ["Data Destruction", "Malware", "DDoS"],
          examples: ["Virus creation", "Website defacement", "DDoS attacks"],
        },
      ],
      penalties: [
        {
          offense: "Section 1 - Basic unauthorized access",
          minPenalty: "£0",
          maxPenalty: "£5,000",
          imprisonment: "Up to 6 months",
          fine: "Up to £5,000",
        },
        {
          offense: "Section 3 - Unauthorized modification",
          minPenalty: "£0",
          maxPenalty: "Unlimited",
          imprisonment: "Up to 10 years",
          fine: "Unlimited",
        },
      ],
      lastUpdated: "2015-05-03",
      jurisdiction: "England, Wales, Scotland, Northern Ireland",
    },
  ],
  australia: [
    {
      id: "CYBERCRIME_ACT_2001",
      country: "Australia",
      title: "Cybercrime Act 2001",
      description: "Federal legislation addressing cybercrime in Australia",
      sections: [
        {
          section: "477.1",
          title: "Unauthorized Access",
          description: "Unauthorized access to, or modification of, restricted data",
          applicableOffenses: ["Hacking", "Data Breach"],
          examples: ["Accessing protected systems", "Modifying restricted data"],
        },
        {
          section: "477.2",
          title: "Unauthorized Modification",
          description: "Unauthorized modification of data to cause damage",
          applicableOffenses: ["Data Destruction", "System Sabotage"],
          examples: ["Deleting critical data", "System corruption"],
        },
        {
          section: "477.3",
          title: "Unauthorized Impairment",
          description: "Unauthorized impairment of electronic communication",
          applicableOffenses: ["DDoS", "Network Disruption"],
          examples: ["DDoS attacks", "Network jamming"],
        },
      ],
      penalties: [
        {
          offense: "Unauthorized access (477.1)",
          minPenalty: "AUD $0",
          maxPenalty: "AUD $133,200",
          imprisonment: "Up to 2 years",
          fine: "Up to AUD $133,200",
        },
        {
          offense: "Serious computer offence",
          minPenalty: "AUD $0",
          maxPenalty: "AUD $666,000",
          imprisonment: "Up to 10 years",
          fine: "Up to AUD $666,000",
        },
      ],
      lastUpdated: "2021-12-02",
      jurisdiction: "Commonwealth of Australia",
    },
  ],
  japan: [
    {
      id: "UNAUTHORIZED_ACCESS_LAW",
      country: "Japan",
      title: "Unauthorized Computer Access Law",
      description: "Law prohibiting unauthorized computer access in Japan",
      sections: [
        {
          section: "3",
          title: "Prohibited Acts",
          description: "Prohibition of unauthorized computer access",
          applicableOffenses: ["Unauthorized Access", "Hacking"],
          examples: ["Password cracking", "System intrusion"],
        },
        {
          section: "4",
          title: "Facilitating Unauthorized Access",
          description: "Prohibition of acts facilitating unauthorized access",
          applicableOffenses: ["Providing Hacking Tools", "Password Sharing"],
          examples: ["Sharing passwords", "Distributing hacking software"],
        },
      ],
      penalties: [
        {
          offense: "Unauthorized access",
          minPenalty: "¥0",
          maxPenalty: "¥1,000,000",
          imprisonment: "Up to 1 year",
          fine: "Up to ¥1,000,000",
        },
        {
          offense: "Facilitating unauthorized access",
          minPenalty: "¥0",
          maxPenalty: "¥500,000",
          imprisonment: "Up to 1 year",
          fine: "Up to ¥500,000",
        },
      ],
      lastUpdated: "2012-05-01",
      jurisdiction: "Japan",
    },
  ],
  china: [
    {
      id: "CYBERSECURITY_LAW_2017",
      country: "China",
      title: "Cybersecurity Law of the People's Republic of China",
      description: "Comprehensive cybersecurity legislation in China",
      sections: [
        {
          section: "27",
          title: "Network Security Incidents",
          description: "Requirements for handling network security incidents",
          applicableOffenses: ["Data Breach", "System Compromise"],
          examples: ["Personal data leaks", "Critical infrastructure attacks"],
        },
        {
          section: "44",
          title: "Personal Information Protection",
          description: "Protection of personal information collected by network operators",
          applicableOffenses: ["Privacy Violation", "Data Misuse"],
          examples: ["Unauthorized data collection", "Personal information trading"],
        },
      ],
      penalties: [
        {
          offense: "Violation of personal information protection",
          minPenalty: "¥100,000",
          maxPenalty: "¥1,000,000",
          imprisonment: "Administrative penalty",
          fine: "¥100,000 to ¥1,000,000",
        },
        {
          offense: "Critical information infrastructure violation",
          minPenalty: "¥100,000",
          maxPenalty: "¥1,000,000",
          imprisonment: "Business suspension possible",
          fine: "¥100,000 to ¥1,000,000",
        },
      ],
      lastUpdated: "2017-06-01",
      jurisdiction: "People's Republic of China",
    },
  ],
  southAfrica: [
    {
      id: "CYBERCRIMES_ACT_2020",
      country: "South Africa",
      title: "Cybercrimes Act, 2020",
      description: "Comprehensive cybercrime legislation for South Africa",
      sections: [
        {
          section: "2",
          title: "Unlawful Access",
          description: "Unlawful access to a computer system or data",
          applicableOffenses: ["Hacking", "Unauthorized Access"],
          examples: ["System intrusion", "Data access without permission"],
        },
        {
          section: "5",
          title: "Cyber Fraud",
          description: "Unlawful acts in respect of software or hardware tool",
          applicableOffenses: ["Cyber Fraud", "Online Scams"],
          examples: ["Online banking fraud", "E-commerce scams"],
        },
        {
          section: "16",
          title: "Cyber Bullying",
          description: "Disclosure of data message to cause harm",
          applicableOffenses: ["Cyberbullying", "Online Harassment"],
          examples: ["Revenge porn", "Online stalking"],
        },
      ],
      penalties: [
        {
          offense: "Unlawful access",
          minPenalty: "R0",
          maxPenalty: "R50,000,000",
          imprisonment: "Up to 15 years",
          fine: "Up to R50,000,000",
        },
        {
          offense: "Cyber bullying",
          minPenalty: "R0",
          maxPenalty: "R150,000",
          imprisonment: "Up to 3 years",
          fine: "Up to R150,000",
        },
      ],
      lastUpdated: "2020-12-01",
      jurisdiction: "Republic of South Africa",
    },
  ],
}

export const INCIDENT_DATABASE: CyberIncident[] = [
  {
    id: "INC_IN_2024_001",
    country: "India",
    type: "Data Breach",
    severity: "HIGH",
    description: "Major healthcare data breach affecting 2.3 million patient records",
    affectedSectors: ["Healthcare", "Insurance"],
    reportedDate: "2024-01-15",
    resolvedDate: "2024-01-25",
    legalActions: ["IT Act Section 43A violation", "DPDP Act compliance review"],
    applicableLaws: ["IT_ACT_2000", "DPDP_ACT_2023"],
    caseStudy: true,
  },
  {
    id: "INC_US_2024_002",
    country: "United States",
    type: "Ransomware",
    severity: "CRITICAL",
    description: "Ransomware attack on critical infrastructure - power grid systems",
    affectedSectors: ["Energy", "Utilities"],
    reportedDate: "2024-01-10",
    legalActions: ["CFAA prosecution initiated", "CISA incident response"],
    applicableLaws: ["CFAA_1986", "PATRIOT_ACT"],
    caseStudy: true,
  },
  {
    id: "INC_UK_2024_003",
    country: "United Kingdom",
    type: "Financial Fraud",
    severity: "HIGH",
    description: "Sophisticated phishing campaign targeting UK banking customers",
    affectedSectors: ["Financial Services", "Banking"],
    reportedDate: "2024-01-12",
    resolvedDate: "2024-01-20",
    legalActions: ["Computer Misuse Act prosecution", "FCA investigation"],
    applicableLaws: ["CMA_1990", "FRAUD_ACT_2006"],
    caseStudy: true,
  },
  {
    id: "INC_AU_2024_004",
    country: "Australia",
    type: "Identity Theft",
    severity: "MEDIUM",
    description: "Large-scale identity theft affecting government services portal",
    affectedSectors: ["Government", "Public Services"],
    reportedDate: "2024-01-08",
    legalActions: ["Cybercrime Act charges filed", "Privacy Act investigation"],
    applicableLaws: ["CYBERCRIME_ACT_2001", "PRIVACY_ACT_1988"],
    caseStudy: true,
  },
  {
    id: "INC_JP_2024_005",
    country: "Japan",
    type: "Corporate Espionage",
    severity: "HIGH",
    description: "Advanced persistent threat targeting Japanese manufacturing companies",
    affectedSectors: ["Manufacturing", "Technology"],
    reportedDate: "2024-01-14",
    legalActions: ["Unauthorized Access Law prosecution", "Trade secret violation"],
    applicableLaws: ["UNAUTHORIZED_ACCESS_LAW", "UNFAIR_COMPETITION_PREVENTION_ACT"],
    caseStudy: true,
  },
]
