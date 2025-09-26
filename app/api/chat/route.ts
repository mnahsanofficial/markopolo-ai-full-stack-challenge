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
          sendChunk({ content: "I'm analyzing your request and the connected data sources...\n\n" })
          await new Promise(resolve => setTimeout(resolve, 1000))

          // Generate campaign recommendation based on data sources and channels
          const recommendation = generateCampaignRecommendation(message, dataSources, channels)
          
          // Stream the recommendation
          sendChunk({ content: "Based on your connected data sources and selected channels, here's my campaign recommendation:\n\n" })
          await new Promise(resolve => setTimeout(resolve, 800))

          sendChunk({ content: `**Campaign: ${recommendation.name}**\n\n` })
          await new Promise(resolve => setTimeout(resolve, 500))

          sendChunk({ content: `${recommendation.description}\n\n` })
          await new Promise(resolve => setTimeout(resolve, 600))

          sendChunk({ content: "**Target Audience:**\n" })
          await new Promise(resolve => setTimeout(resolve, 300))
          sendChunk({ content: `• Segments: ${recommendation.targetAudience.segments.join(', ')}\n` })
          await new Promise(resolve => setTimeout(resolve, 200))
          sendChunk({ content: `• Demographics: ${Object.entries(recommendation.targetAudience.demographics).map(([k, v]) => `${k}: ${v}`).join(', ')}\n` })
          await new Promise(resolve => setTimeout(resolve, 200))
          sendChunk({ content: `• Behaviors: ${recommendation.targetAudience.behaviors.join(', ')}\n\n` })
          await new Promise(resolve => setTimeout(resolve, 400))

          sendChunk({ content: "**Optimal Timing:**\n" })
          await new Promise(resolve => setTimeout(resolve, 300))
          sendChunk({ content: `• Best times: ${recommendation.timing.optimalTimes.join(', ')}\n` })
          await new Promise(resolve => setTimeout(resolve, 200))
          sendChunk({ content: `• Frequency: ${recommendation.timing.frequency}\n` })
          await new Promise(resolve => setTimeout(resolve, 200))
          sendChunk({ content: `• Duration: ${recommendation.timing.duration}\n\n` })
          await new Promise(resolve => setTimeout(resolve, 400))

          sendChunk({ content: "**Channel Strategy:**\n" })
          await new Promise(resolve => setTimeout(resolve, 300))
          sendChunk({ content: `• Primary: ${recommendation.channels.primary}\n` })
          await new Promise(resolve => setTimeout(resolve, 200))
          sendChunk({ content: `• Secondary: ${recommendation.channels.secondary.join(', ')}\n` })
          await new Promise(resolve => setTimeout(resolve, 200))
          sendChunk({ content: `• Budget allocation: ${Object.entries(recommendation.channels.budget).map(([k, v]) => `${k}: $${v}`).join(', ')}\n\n` })
          await new Promise(resolve => setTimeout(resolve, 400))

          sendChunk({ content: "**Content Strategy:**\n" })
          await new Promise(resolve => setTimeout(resolve, 300))
          if (recommendation.content.subject) {
            sendChunk({ content: `• Subject: ${recommendation.content.subject}\n` })
            await new Promise(resolve => setTimeout(resolve, 200))
          }
          sendChunk({ content: `• Headline: ${recommendation.content.headline}\n` })
          await new Promise(resolve => setTimeout(resolve, 200))
          sendChunk({ content: `• Body: ${recommendation.content.body}\n` })
          await new Promise(resolve => setTimeout(resolve, 200))
          sendChunk({ content: `• CTA: ${recommendation.content.cta}\n\n` })
          await new Promise(resolve => setTimeout(resolve, 400))

          sendChunk({ content: "**Expected Performance:**\n" })
          await new Promise(resolve => setTimeout(resolve, 300))
          sendChunk({ content: `• Reach: ${recommendation.metrics.expectedReach.toLocaleString()} users\n` })
          await new Promise(resolve => setTimeout(resolve, 200))
          sendChunk({ content: `• Engagement: ${recommendation.metrics.expectedEngagement}%\n` })
          await new Promise(resolve => setTimeout(resolve, 200))
          sendChunk({ content: `• Conversion: ${recommendation.metrics.expectedConversion}%\n\n` })
          await new Promise(resolve => setTimeout(resolve, 400))

          // Stream the JSON payload
          sendChunk({ content: "**Executable Campaign JSON:**\n\n" })
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const jsonPayload = JSON.stringify(recommendation, null, 2)
          const jsonLines = jsonPayload.split('\n')
          
          for (const line of jsonLines) {
            sendChunk({ content: `${line}\n` })
            await new Promise(resolve => setTimeout(resolve, 50))
          }

          sendChunk({ content: "\n\nThis JSON payload can be directly used to execute the campaign across your selected channels and data sources." })
          
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
