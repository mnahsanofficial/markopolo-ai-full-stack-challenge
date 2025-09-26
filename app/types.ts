export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  isStreaming?: boolean
}

export interface DataSource {
  id: string
  name: string
  type: 'gtm' | 'facebook_pixel' | 'google_ads_tag'
  status: 'connected' | 'disconnected' | 'error'
  lastSync?: Date
  config?: Record<string, any>
}

export interface Channel {
  id: string
  name: string
  type: 'email' | 'sms' | 'push' | 'whatsapp'
  status: 'active' | 'inactive'
  config?: Record<string, any>
}

export interface CampaignRecommendation {
  id: string
  name: string
  description: string
  targetAudience: {
    segments: string[]
    demographics: Record<string, any>
    behaviors: string[]
  }
  timing: {
    optimalTimes: string[]
    frequency: string
    duration: string
  }
  channels: {
    primary: string
    secondary: string[]
    budget: Record<string, number>
  }
  content: {
    subject?: string
    headline: string
    body: string
    cta: string
    media?: string[]
  }
  metrics: {
    expectedReach: number
    expectedEngagement: number
    expectedConversion: number
  }
}
