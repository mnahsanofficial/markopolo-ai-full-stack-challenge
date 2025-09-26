import { NextRequest, NextResponse } from 'next/server'
import { DataSource, Channel, CampaignRecommendation } from '../../types'

export async function POST(request: NextRequest) {
  try {
    const { message, dataSources, channels } = await request.json()

    // Create a readable stream for Server-Sent Events
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder()
        
        const sendChunk = (data: any) => {
          const chunk = `data: ${JSON.stringify(data)}\n\n`
          controller.enqueue(encoder.encode(chunk))
        }

        const simulateStreaming = async () => {
          // Generate campaign recommendation based on data sources and channels
          const recommendation = generateCampaignRecommendation(message, dataSources, channels)
          
          // Build the complete formatted response
          const fullResponse = `🔍 **Analyzing your request and connected data sources...**

Based on your connected data sources and selected channels, here's my **AI-powered campaign recommendation**:

## 🎯 **Campaign: ${recommendation.name}**

> ${recommendation.description}

### 👥 **Target Audience**

**Segments:**
${recommendation.targetAudience.segments.map(segment => `- ${segment}`).join('\n')}

**Demographics:**
${Object.entries(recommendation.targetAudience.demographics).map(([key, value]) => `- **${key.charAt(0).toUpperCase() + key.slice(1)}**: ${value}`).join('\n')}

**Behaviors:**
${recommendation.targetAudience.behaviors.map(behavior => `- ${behavior}`).join('\n')}

### ⏰ **Optimal Timing**

**Best Times:**
${recommendation.timing.optimalTimes.map(time => `- ${time}`).join('\n')}
- **Frequency**: ${recommendation.timing.frequency}
- **Duration**: ${recommendation.timing.duration}

### 📱 **Channel Strategy**

- **Primary Channel**: ${recommendation.channels.primary}
- **Secondary Channels**: ${recommendation.channels.secondary.join(', ')}

**Budget Allocation:**
${Object.entries(recommendation.channels.budget).map(([channel, amount]) => `- **${channel}**: $${amount.toLocaleString()}`).join('\n')}

### 📝 **Content Strategy**

${recommendation.content.subject ? `- **Subject Line**: "${recommendation.content.subject}"` : ''}
- **Headline**: "${recommendation.content.headline}"
- **Body**: "${recommendation.content.body}"
- **Call-to-Action**: "${recommendation.content.cta}"

### 📊 **Expected Performance**

| Metric | Value |
|--------|-------|
| **Reach** | ${recommendation.metrics.expectedReach.toLocaleString()} users |
| **Engagement Rate** | ${recommendation.metrics.expectedEngagement}% |
| **Conversion Rate** | ${recommendation.metrics.expectedConversion}% |

### 🚀 **Executable Campaign JSON**

\`\`\`json
${JSON.stringify(recommendation, null, 2)}
\`\`\`

> 💡 **Ready to Execute**: This JSON payload can be directly used to execute the campaign across your selected channels and data sources. Simply copy the JSON and integrate it with your marketing automation platform.`

          // Stream the response word by word like ChatGPT
          let currentContent = ""
          const words = fullResponse.split(' ')
          
          for (let i = 0; i < words.length; i++) {
            currentContent += (i > 0 ? ' ' : '') + words[i]
            sendChunk({ content: currentContent })
            
            // Variable delay based on content type
            const word = words[i]
            let delay = 30 // Base delay
            
            if (word.includes('\n')) delay = 100 // Longer pause for line breaks
            if (word.includes('##') || word.includes('###')) delay = 150 // Pause for headers
            if (word.includes('```')) delay = 80 // Pause for code blocks
            if (word.includes('|')) delay = 50 // Pause for tables
            
            await new Promise(resolve => setTimeout(resolve, delay))
          }
          
          // Send final completion signal
          sendChunk({ content: "[DONE]" })
          controller.close()
        }

        simulateStreaming()
      }
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateCampaignRecommendation(
  message: string, 
  dataSources: DataSource[], 
  channels: Channel[]
): CampaignRecommendation {
  const campaignTypes = [
    'Product Launch Campaign',
    'Retargeting Campaign',
    'Seasonal Promotion',
    'Customer Retention',
    'Brand Awareness',
    'Lead Generation'
  ]

  const segments = [
    'High-value customers',
    'Cart abandoners',
    'New subscribers',
    'Frequent buyers',
    'Price-sensitive users',
    'Mobile users',
    'Desktop users'
  ]

  const behaviors = [
    'Frequent website visits',
    'High engagement with emails',
    'Mobile app usage',
    'Social media interaction',
    'Search behavior',
    'Purchase history'
  ]

  const optimalTimes = [
    '9:00 AM - 11:00 AM',
    '2:00 PM - 4:00 PM',
    '7:00 PM - 9:00 PM'
  ]

  const frequencies = [
    'Daily',
    'Every 2 days',
    'Weekly',
    'Bi-weekly'
  ]

  const durations = [
    '1 week',
    '2 weeks',
    '1 month',
    '6 weeks'
  ]

  // Generate random but realistic campaign data
  const campaignType = campaignTypes[Math.floor(Math.random() * campaignTypes.length)]
  const selectedSegments = segments.slice(0, Math.floor(Math.random() * 3) + 2)
  const selectedBehaviors = behaviors.slice(0, Math.floor(Math.random() * 3) + 2)
  const selectedTimes = optimalTimes.slice(0, Math.floor(Math.random() * 2) + 1)

  const primaryChannel = channels[0]?.name || 'Email'
  const secondaryChannels = channels.slice(1).map(c => c.name)

  // Generate budget allocation
  const totalBudget = 10000
  const channelBudget: Record<string, number> = {}
  channels.forEach((channel, index) => {
    const percentage = index === 0 ? 60 : 40 / (channels.length - 1)
    channelBudget[channel.name] = Math.round(totalBudget * percentage / 100)
  })

  return {
    id: `campaign_${Date.now()}`,
    name: campaignType,
    description: `A targeted campaign designed to maximize engagement and conversions using insights from your connected data sources. This campaign leverages ${dataSources.length} data source(s) and ${channels.length} channel(s) to deliver personalized experiences.`,
    targetAudience: {
      segments: selectedSegments,
      demographics: {
        age: '25-45',
        gender: 'All',
        location: 'Primary markets',
        income: 'Middle to high'
      },
      behaviors: selectedBehaviors
    },
    timing: {
      optimalTimes: selectedTimes,
      frequency: frequencies[Math.floor(Math.random() * frequencies.length)],
      duration: durations[Math.floor(Math.random() * durations.length)]
    },
    channels: {
      primary: primaryChannel,
      secondary: secondaryChannels,
      budget: channelBudget
    },
    content: {
      subject: primaryChannel === 'Email' ? 'Exclusive Offer Just for You!' : undefined,
      headline: 'Don\'t Miss Out - Limited Time Offer',
      body: 'Based on your preferences and behavior, we\'ve crafted this special offer just for you. Take advantage of this exclusive opportunity.',
      cta: 'Claim Your Offer Now',
      media: ['hero-image.jpg', 'product-showcase.jpg']
    },
    metrics: {
      expectedReach: Math.floor(Math.random() * 50000) + 10000,
      expectedEngagement: Math.floor(Math.random() * 15) + 5,
      expectedConversion: Math.floor(Math.random() * 8) + 2
    }
  }
}
