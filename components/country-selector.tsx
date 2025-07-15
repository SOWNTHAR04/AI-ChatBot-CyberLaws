"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Globe } from "lucide-react"

interface CountrySelectorProps {
  selectedCountry: string
  onCountryChange: (country: string) => void
}

export function CountrySelector({ selectedCountry, onCountryChange }: CountrySelectorProps) {
  const countries = [
    { code: "global", name: "Global", flag: "🌍" },
    { code: "india", name: "India", flag: "🇮🇳" },
    { code: "usa", name: "United States", flag: "🇺🇸" },
    { code: "uk", name: "United Kingdom", flag: "🇬🇧" },
    { code: "australia", name: "Australia", flag: "🇦🇺" },
    { code: "japan", name: "Japan", flag: "🇯🇵" },
    { code: "china", name: "China", flag: "🇨🇳" },
    { code: "southAfrica", name: "South Africa", flag: "🇿🇦" },
  ]

  return (
    <div className="flex items-center space-x-3">
      <Globe className="h-5 w-5 text-gray-600" />
      <Select value={selectedCountry} onValueChange={onCountryChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select jurisdiction" />
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{country.flag}</span>
                <span>{country.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Badge variant="outline" className="bg-blue-50 text-blue-700">
        {countries.find((c) => c.code === selectedCountry)?.name || "Global"}
      </Badge>
    </div>
  )
}
