"use client"

import { useChat } from "ai/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Shield, FileText, MessageSquare, Phone, Activity, Database, Globe } from "lucide-react"
import { DatabaseStatus } from "@/components/database-status"

export default function CyberLawChatbot() {
  const [conversationMode, setConversationMode] = useState("assistance")
  const [selectedCountry, setSelectedCountry] = useState("global")
  const [activeTab, setActiveTab] = useState("chat")

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isChatLoading,
  } = useChat({
    body: { mode: conversationMode, country: selectedCountry },
  })

  // Parse role from AI responses
  const parseMessageRole = (content: string) => {
    if (content.startsWith("ROLE:victim")) {
      return { role: "victim", content: content.replace("ROLE:victim", "").trim() }
    } else if (content.startsWith("ROLE:officer")) {
      return { role: "officer", content: content.replace("ROLE:officer", "").trim() }
    } else if (content.startsWith("ROLE:system")) {
      return { role: "system", content: content.replace("ROLE:system", "").trim() }
    } else {
      return { role: "assistant", content: content.replace("ROLE:assistant", "").trim() }
    }
  }

  const enhancedMessages = messages.map((msg) => {
    if (msg.role === "assistant") {
      const parsed = parseMessageRole(msg.content)
      return {
        ...msg,
        content: parsed.content,
        messageRole: parsed.role,
      }
    }
    return msg
  })

  const countries = [
    { code: "global", name: "Global", flag: "🌍" },
    { code: "India", name: "India", flag: "🇮🇳" },
    { code: "United States", name: "United States", flag: "🇺🇸" },
    { code: "United Kingdom", name: "United Kingdom", flag: "🇬🇧" },
    { code: "Australia", name: "Australia", flag: "🇦🇺" },
    { code: "Japan", name: "Japan", flag: "🇯🇵" },
    { code: "China", name: "China", flag: "🇨🇳" },
    { code: "South Africa", name: "South Africa", flag: "🇿🇦" },
  ]

  const quickQuestions = {
    assistance: [
      "I think I've been phished, what should I do?",
      "Someone stole my identity online, help me report it",
      "I received a ransomware message, what are my options?",
      "My bank account was hacked, what evidence do I need?",
      "What cyber laws protect me in my country?",
      "How do I report a cybercrime internationally?",
    ],
    simulation: [
      "Start a phishing victim simulation",
      "Role-play a ransomware attack victim",
      "Simulate an identity theft case",
      "Practice with a cyberbullying victim",
      "Create a cross-border fraud scenario",
      "Simulate a corporate data breach victim",
    ],
    interview: [
      "How should I start a victim interview?",
      "What questions help identify the attack type?",
      "How do I handle emotional victims?",
      "What evidence should I ask for?",
      "How do I handle cross-jurisdictional cases?",
      "What are the cultural considerations?",
    ],
    education: [
      "Compare cyber laws between countries",
      "What are the main cyber crime laws globally?",
      "Explain international cyber crime cooperation",
      "What are victim rights in different countries?",
      "How do penalties differ across jurisdictions?",
      "What are recent developments in cyber law?",
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Global Cyber Law Assistant</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            AI-powered assistance with live database of global cyber laws, CISA alerts, and real incident data
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="chat">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="database">
              <Database className="h-4 w-4 mr-2" />
              Database
            </TabsTrigger>
            <TabsTrigger value="incident">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Incidents
            </TabsTrigger>
            <TabsTrigger value="report">
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="emergency">
              <Phone className="h-4 w-4 mr-2" />
              Emergency
            </TabsTrigger>
            <TabsTrigger value="monitoring">
              <Activity className="h-4 w-4 mr-2" />
              Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-6">
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {["assistance", "simulation", "interview", "education"].map((mode) => (
                  <Card
                    key={mode}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      conversationMode === mode ? "ring-2 ring-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => setConversationMode(mode)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="font-medium capitalize">{mode}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {mode === "assistance" && "Help victims"}
                        {mode === "simulation" && "Training mode"}
                        {mode === "interview" && "Practice interviews"}
                        {mode === "education" && "Learn laws"}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-gray-600" />
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 mr-2" />
                        Global Cyber Law Assistant
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={`
                          ${conversationMode === "assistance" ? "bg-blue-500" : ""}
                          ${conversationMode === "simulation" ? "bg-red-500" : ""}
                          ${conversationMode === "interview" ? "bg-green-500" : ""}
                          ${conversationMode === "education" ? "bg-purple-500" : ""}
                        `}
                        >
                          {conversationMode.charAt(0).toUpperCase() + conversationMode.slice(1)} Mode
                        </Badge>
                        <Badge variant="outline">
                          {countries.find((c) => c.code === selectedCountry)?.flag}{" "}
                          {countries.find((c) => c.code === selectedCountry)?.name}
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto space-y-4">
                    {enhancedMessages.length === 0 && (
                      <div className="text-center text-gray-500 mt-8">
                        <div className="animate-bounce">
                          <Shield className="h-16 w-16 mx-auto mb-4 text-blue-300" />
                        </div>
                        <p className="text-lg mb-2">Welcome to Global Cyber Law Assistant</p>
                        <p>Ask me about cyber laws, incidents, or get help with cyber crimes from around the world</p>
                      </div>
                    )}
                    {enhancedMessages.map((m, index) => (
                      <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] p-4 rounded-lg shadow-sm transition-all duration-500 ${
                            m.role === "user"
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto"
                              : m.messageRole === "victim"
                                ? "bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-200"
                                : m.messageRole === "officer"
                                  ? "bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200"
                                  : "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{m.content}</div>
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                            <span className="text-blue-700">Analyzing with global database...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                      <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask about cyber laws, incidents, or get help with cyber crimes..."
                        className="flex-1"
                        disabled={isChatLoading}
                      />
                      <Button type="submit" disabled={isChatLoading}>
                        Send
                      </Button>
                    </form>
                  </CardFooter>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {quickQuestions[conversationMode]?.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full text-left justify-start h-auto p-3 text-sm bg-transparent"
                        onClick={() => {
                          const event = { target: { value: question } } as any
                          handleInputChange(event)
                          handleSubmit({ preventDefault: () => {} } as any)
                        }}
                      >
                        {question}
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Global Coverage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {countries.slice(1).map((country) => (
                        <Badge key={country.code} variant="outline" className="justify-center">
                          {country.flag} {country.name}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                      Live database with cyber laws, incidents, and CISA alerts from major jurisdictions.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="database" className="mt-6">
            <DatabaseStatus />
          </TabsContent>

          <TabsContent value="incident" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Incident Analysis & Classification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Financial Crimes</h3>
                    <div className="space-y-2">
                      <Badge variant="outline">Credit Card Fraud</Badge>
                      <Badge variant="outline">Online Banking Fraud</Badge>
                      <Badge variant="outline">Cryptocurrency Scams</Badge>
                      <Badge variant="outline">Investment Fraud</Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Data Crimes</h3>
                    <div className="space-y-2">
                      <Badge variant="outline">Data Theft</Badge>
                      <Badge variant="outline">Privacy Violation</Badge>
                      <Badge variant="outline">Unauthorized Access</Badge>
                      <Badge variant="outline">Data Manipulation</Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Social Crimes</h3>
                    <div className="space-y-2">
                      <Badge variant="outline">Cyberbullying</Badge>
                      <Badge variant="outline">Online Harassment</Badge>
                      <Badge variant="outline">Defamation</Badge>
                      <Badge variant="outline">Stalking</Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Incident Analysis Process:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Document the incident immediately</li>
                    <li>Preserve digital evidence</li>
                    <li>Identify the type of cyber attack</li>
                    <li>Assess the impact and damages</li>
                    <li>Report to appropriate authorities</li>
                    <li>Follow up on investigation</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="report" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Cyber Crime Reporting Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Required Information</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Date and time of incident
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Detailed description of the incident
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Financial loss amount (if any)
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Screenshots and evidence
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Communication records
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Reporting Channels</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          National Cyber Crime Portal
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Local Police Cyber Cell
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Banking Fraud Helpline
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Consumer Helpline
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Regulatory Authorities
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold mb-2 text-yellow-800">Important Notes:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Report incidents as soon as possible</li>
                      <li>• Do not delete any evidence</li>
                      <li>• Keep all communication records</li>
                      <li>• Follow up regularly on your complaint</li>
                      <li>• Seek legal advice if needed</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Emergency Contacts & Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Emergency Helplines</h3>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 border rounded-lg">
                        <Phone className="h-5 w-5 mr-3 text-green-600" />
                        <div>
                          <div className="font-medium">Cyber Crime Helpline (India)</div>
                          <div className="text-sm text-gray-600">1930</div>
                        </div>
                      </div>
                      <div className="flex items-center p-3 border rounded-lg">
                        <Phone className="h-5 w-5 mr-3 text-green-600" />
                        <div>
                          <div className="font-medium">FBI IC3 (USA)</div>
                          <div className="text-sm text-gray-600">ic3.gov</div>
                        </div>
                      </div>
                      <div className="flex items-center p-3 border rounded-lg">
                        <Phone className="h-5 w-5 mr-3 text-green-600" />
                        <div>
                          <div className="font-medium">Action Fraud (UK)</div>
                          <div className="text-sm text-gray-600">0300 123 2040</div>
                        </div>
                      </div>
                      <div className="flex items-center p-3 border rounded-lg">
                        <Phone className="h-5 w-5 mr-3 text-green-600" />
                        <div>
                          <div className="font-medium">ACORN (Australia)</div>
                          <div className="text-sm text-gray-600">acorn.gov.au</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Online Resources</h3>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">National Cyber Crime Portal</div>
                        <div className="text-sm text-gray-600">cybercrime.gov.in</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">Cyber Security Guidelines</div>
                        <div className="text-sm text-gray-600">cert-in.org.in</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">Legal Aid Services</div>
                        <div className="text-sm text-gray-600">nalsa.gov.in</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">CISA Cybersecurity</div>
                        <div className="text-sm text-gray-600">cisa.gov</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold mb-2 text-red-800">In Case of Emergency:</h4>
                  <p className="text-sm text-red-700">
                    If you are facing immediate threat or ongoing cyber attack, contact local police or cyber crime
                    helpline immediately. Do not delay reporting serious incidents.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="mt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Incidents</p>
                        <p className="text-3xl font-bold text-red-600">247</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-500 animate-pulse" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Resolved Today</p>
                        <p className="text-3xl font-bold text-green-600">156</p>
                      </div>
                      <Shield className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Threat Actors</p>
                        <p className="text-3xl font-bold text-orange-600">23</p>
                      </div>
                      <Activity className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">CISA Alerts</p>
                        <p className="text-3xl font-bold text-purple-600">12</p>
                      </div>
                      <Database className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Recent Global Incidents
                      <Badge className="ml-2 animate-pulse">LIVE</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 border-l-4 border-l-red-500 bg-red-50 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-red-800">Ransomware Attack - Healthcare</h4>
                            <p className="text-sm text-red-600">Multiple hospitals affected in India</p>
                          </div>
                          <Badge variant="destructive">CRITICAL</Badge>
                        </div>
                        <p className="text-xs text-red-500 mt-2">2 hours ago</p>
                      </div>

                      <div className="p-3 border-l-4 border-l-yellow-500 bg-yellow-50 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-yellow-800">Phishing Campaign - Banking</h4>
                            <p className="text-sm text-yellow-600">Targeting UK financial institutions</p>
                          </div>
                          <Badge variant="default">HIGH</Badge>
                        </div>
                        <p className="text-xs text-yellow-500 mt-2">4 hours ago</p>
                      </div>

                      <div className="p-3 border-l-4 border-l-blue-500 bg-blue-50 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-blue-800">Data Breach - E-commerce</h4>
                            <p className="text-sm text-blue-600">Customer data exposed in Australia</p>
                          </div>
                          <Badge variant="secondary">MEDIUM</Badge>
                        </div>
                        <p className="text-xs text-blue-500 mt-2">6 hours ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      Global Threat Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🇮🇳</span>
                          <span>India</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                          </div>
                          <span className="text-sm font-medium">89</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🇺🇸</span>
                          <span>USA</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                          </div>
                          <span className="text-sm font-medium">67</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🇬🇧</span>
                          <span>UK</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                          </div>
                          <span className="text-sm font-medium">45</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🇦🇺</span>
                          <span>Australia</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "35%" }}></div>
                          </div>
                          <span className="text-sm font-medium">34</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🇯🇵</span>
                          <span>Japan</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: "25%" }}></div>
                          </div>
                          <span className="text-sm font-medium">23</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
