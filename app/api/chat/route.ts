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
          // Initial response
          sendChunk({ content: "🔍 **Analyzing your request and connected data sources...**\n\n" })
          await new Promise(resolve => setTimeout(resolve, 1000))

          // Generate campaign recommendation based on data sources and channels
          const recommendation = generateCampaignRecommendation(message, dataSources, channels)
          
          // Stream the recommendation with better formatting
          sendChunk({ content: "Based on your connected data sources and selected channels, here's my **AI-powered campaign recommendation**:\n\n" })
          await new Promise(resolve => setTimeout(resolve, 800))

          sendChunk({ content: `## 🎯 **Campaign: ${recommendation.name}**\n\n` })
          await new Promise(resolve => setTimeout(resolve, 500))

          sendChunk({ content: `> ${recommendation.description}\n\n` })
          await new Promise(resolve => setTimeout(resolve, 600))

          sendChunk({ content: "### 👥 **Target Audience**\n\n" })
          await new Promise(resolve => setTimeout(resolve, 300))
          sendChunk({ content: "**Segments:**\n" })
          recommendation.targetAudience.segments.forEach((segment, index) => {
            sendChunk({ content: `- ${segment}\n` })
          })
          await new Promise(resolve => setTimeout(resolve, 200))
          
          sendChunk({ content: "\n**Demographics:**\n" })
          Object.entries(recommendation.targetAudience.demographics).forEach(([key, value]) => {
            sendChunk({ content: `- **${key.charAt(0).toUpperCase() + key.slice(1)}**: ${value}\n` })
          })
          await new Promise(resolve => setTimeout(resolve, 200))
          
          sendChunk({ content: "\n**Behaviors:**\n" })
          recommendation.targetAudience.behaviors.forEach((behavior, index) => {
            sendChunk({ content: `- ${behavior}\n` })
          })
          await new Promise(resolve => setTimeout(resolve, 400))

          sendChunk({ content: "\n### ⏰ **Optimal Timing**\n\n" })
          await new Promise(resolve => setTimeout(resolve, 300))
          sendChunk({ content: "**Best Times:**\n" })
          recommendation.timing.optimalTimes.forEach((time, index) => {
            sendChunk({ content: `- ${time}\n` })
          })
          await new Promise(resolve => setTimeout(resolve, 200))
          sendChunk({ content: `- **Frequency**: ${recommendation.timing.frequency}\n` })
          await new Promise(resolve => setTimeout(resolve, 200))
          sendChunk({ content: `- **Duration**: ${recommendation.timing.duration}\n\n` })
          await new Promise(resolve => setTimeout(resolve, 400))

          sendChunk({ content: "### 📱 **Channel Strategy**\n\n" })
          await new Promise(resolve => setTimeout(resolve, 300))
          sendChunk({ content: `- **Primary Channel**: ${recommendation.channels.primary}\n` })
          await new Promise(resolve => setTimeout(resolve, 200))
          sendChunk({ content: `- **Secondary Channels**: ${recommendation.channels.secondary.join(', ')}\n\n` })
          await new Promise(resolve => setTimeout(resolve, 200))
          
          sendChunk({ content: "**Budget Allocation:**\n" })
          Object.entries(recommendation.channels.budget).forEach(([channel, amount]) => {
            sendChunk({ content: `- **${channel}**: $${amount.toLocaleString()}\n` })
          })
          await new Promise(resolve => setTimeout(resolve, 400))

          sendChunk({ content: "\n### 📝 **Content Strategy**\n\n" })
          await new Promise(resolve => setTimeout(resolve, 300))
          if (recommendation.content.subject) {
            sendChunk({ content: `- **Subject Line**: "${recommendation.content.subject}"\n` })
            await new Promise(resolve => setTimeout(resolve, 200))
          }
          sendChunk({ content: `- **Headline**: "${recommendation.content.headline}"\n` })
          await new Promise(resolve => setTimeout(resolve, 200))
          sendChunk({ content: `- **Body**: "${recommendation.content.body}"\n` })
          await new Promise(resolve => setTimeout(resolve, 200))
          sendChunk({ content: `- **Call-to-Action**: "${recommendation.content.cta}"\n\n` })
          await new Promise(resolve => setTimeout(resolve, 400))

          sendChunk({ content: "### 📊 **Expected Performance**\n\n" })
          await new Promise(resolve => setTimeout(resolve, 300))
          sendChunk({ content: `| Metric | Value |\n|--------|-------|\n` })
          await new Promise(resolve => setTimeout(resolve, 200))
          sendChunk({ content: `| **Reach** | ${recommendation.metrics.expectedReach.toLocaleString()} users |\n` })
          await new Promise(resolve => setTimeout(resolve, 200))
          sendChunk({ content: `| **Engagement Rate** | ${recommendation.metrics.expectedEngagement}% |\n` })
          await new Promise(resolve => setTimeout(resolve, 200))
          sendChunk({ content: `| **Conversion Rate** | ${recommendation.metrics.expectedConversion}% |\n\n` })
          await new Promise(resolve => setTimeout(resolve, 400))

          // Stream the JSON payload with proper formatting
          sendChunk({ content: "### 🚀 **Executable Campaign JSON**\n\n" })
          await new Promise(resolve => setTimeout(resolve, 500))
          
          sendChunk({ content: "```json\n" })
          const jsonPayload = JSON.stringify(recommendation, null, 2)
          const jsonLines = jsonPayload.split('\n')
          
          for (const line of jsonLines) {
            sendChunk({ content: `${line}\n` })
            await new Promise(resolve => setTimeout(resolve, 30))
          }
          sendChunk({ content: "\n```\n\n" })

          sendChunk({ content: "> 💡 **Ready to Execute**: This JSON payload can be directly used to execute the campaign across your selected channels and data sources. Simply copy the JSON and integrate it with your marketing automation platform.\n\n" })
          
          // End the stream
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
