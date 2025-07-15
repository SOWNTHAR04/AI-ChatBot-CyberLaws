import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database Types
export interface CyberLaw {
  id: string
  country: string
  title: string
  description: string
  sections: any[]
  penalties: any[]
  last_updated: string
  jurisdiction: string
  created_at: string
}

export interface CyberIncident {
  id: string
  country: string
  incident_type: string
  severity: string
  description: string
  affected_sectors: string[]
  reported_date: string
  resolved_date?: string
  legal_actions: string[]
  applicable_laws: string[]
  source: string
  created_at: string
}

export interface TrainingData {
  id: string
  input_text: string
  output_text: string
  context: any
  metadata: any
  created_at: string
}

export interface CisaAlert {
  id: string
  alert_id: string
  title: string
  severity: string
  description: string
  affected_sectors: string[]
  published_date: string
  updated_date: string
  source_url: string
  created_at: string
}
