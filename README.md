# Perplexity Chat Clone - Marketing AI Assistant

A modern chat interface similar to Perplexity that allows users to connect to various data sources and channels, then receive AI-powered campaign recommendations with streaming JSON output.

## Features

### 🎯 Data Sources Integration
- **Google Tag Manager (GTM)** - Track website interactions and user behavior
- **Facebook Pixel** - Track conversions and optimize Facebook ads  
- **Google Ads Tag** - Track Google Ads performance and conversions

### 📱 Multi-Channel Support
- **Email** - Personalized email campaigns with A/B testing
- **SMS** - High-engagement text message campaigns
- **Push Notifications** - Real-time mobile notifications
- **WhatsApp** - Rich media messaging with global reach

### 🤖 AI-Powered Campaign Generation
- Real-time streaming responses
- Personalized campaign recommendations
- Executable JSON payloads for campaign execution
- Right time, right channel, right message optimization

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Streaming**: Server-Sent Events (SSE)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/perplexity-chat-clone.git
cd perplexity-chat-clone
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Connect Data Sources**: Click "Data Sources" to connect GTM, Facebook Pixel, or Google Ads Tag
2. **Select Channels**: Choose from Email, SMS, Push Notifications, or WhatsApp
3. **Ask for Campaigns**: Type your request in the chat interface
4. **Get Recommendations**: Receive streaming AI responses with executable JSON payloads

## Project Structure

```
├── app/
│   ├── api/chat/          # Chat API with streaming responses
│   ├── components/        # React components
│   │   ├── ChatMessage.tsx
│   │   ├── DataSourceConnector.tsx
│   │   └── ChannelSelector.tsx
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main chat interface
│   └── types.ts           # TypeScript definitions
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

## API Endpoints

### POST /api/chat
Streams AI-generated campaign recommendations based on connected data sources and selected channels.

**Request Body:**
```json
{
  "message": "Create a campaign for my new product launch",
  "dataSources": [
    {
      "id": "gtm",
      "name": "Google Tag Manager",
      "type": "gtm",
      "status": "connected"
    }
  ],
  "channels": [
    {
      "id": "email",
      "name": "Email",
      "type": "email",
      "status": "active"
    }
  ]
}
```

**Response:** Server-Sent Events stream with campaign recommendations and executable JSON payloads.

## Campaign JSON Structure

The AI generates executable JSON payloads with the following structure:

```json
{
  "id": "campaign_1234567890",
  "name": "Product Launch Campaign",
  "description": "Campaign description...",
  "targetAudience": {
    "segments": ["High-value customers", "New subscribers"],
    "demographics": {
      "age": "25-45",
      "gender": "All",
      "location": "Primary markets"
    },
    "behaviors": ["Frequent website visits", "High engagement"]
  },
  "timing": {
    "optimalTimes": ["9:00 AM - 11:00 AM", "7:00 PM - 9:00 PM"],
    "frequency": "Daily",
    "duration": "2 weeks"
  },
  "channels": {
    "primary": "Email",
    "secondary": ["SMS", "Push"],
    "budget": {
      "Email": 6000,
      "SMS": 2000,
      "Push": 2000
    }
  },
  "content": {
    "subject": "Exclusive Offer Just for You!",
    "headline": "Don't Miss Out - Limited Time Offer",
    "body": "Based on your preferences...",
    "cta": "Claim Your Offer Now"
  },
  "metrics": {
    "expectedReach": 25000,
    "expectedEngagement": 12,
    "expectedConversion": 5
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Demo

🎉 **Live Demo**: [https://chat-sample-6rtdr34u5-mnahsanofficials-projects.vercel.app](https://chat-sample-6rtdr34u5-mnahsanofficials-projects.vercel.app)

The application is now live and ready to use! Try connecting data sources and channels, then ask for campaign recommendations.

