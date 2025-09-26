'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Plus, Settings, Zap, Database, MessageSquare, Bot } from 'lucide-react'
import ChatMessage from './components/ChatMessage'
import DataSourceConnector from './components/DataSourceConnector'
import ChannelSelector from './components/ChannelSelector'
import { Message, DataSource, Channel } from './types'

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDataSourceConnector, setShowDataSourceConnector] = useState(false)
  const [showChannelSelector, setShowChannelSelector] = useState(false)
  const [connectedDataSources, setConnectedDataSources] = useState<DataSource[]>([])
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

      try {
        // Simulate streaming response
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: inputValue,
            dataSources: connectedDataSources,
            channels: selectedChannels,
          }),
        })

        if (!response.body) return

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: '',
          role: 'assistant',
          timestamp: new Date(),
          isStreaming: true,
        }

        setMessages(prev => [...prev, assistantMessage])

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              
              try {
                const parsed = JSON.parse(data)
                
                // Check for completion signal
                if (parsed.done) {
                  setMessages(prev => 
                    prev.map(msg => 
                      msg.id === assistantMessage.id 
                        ? { ...msg, isStreaming: false }
                        : msg
                    )
                  )
                  return
                }
                
                // Handle content updates
                if (parsed.content) {
                  assistantMessage.content = parsed.content
                  setMessages(prev => 
                    prev.map(msg => 
                      msg.id === assistantMessage.id 
                        ? { ...msg, content: assistantMessage.content }
                        : msg
                    )
                  )
                }
              } catch (e) {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }
        }
      } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              Marketing AI Assistant
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDataSourceConnector(true)}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <Database className="w-4 h-4" />
              <span>Data Sources</span>
              {connectedDataSources.length > 0 && (
                <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                  {connectedDataSources.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowChannelSelector(true)}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Channels</span>
              {selectedChannels.length > 0 && (
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                  {selectedChannels.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Welcome to Marketing AI Assistant
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Connect your data sources and channels, then ask me to help you create the right campaign for the right audience at the right time.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setShowDataSourceConnector(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Connect Data Sources
              </button>
              <button
                onClick={() => setShowChannelSelector(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Select Channels
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-6">
                <div className="flex max-w-[80%] items-start space-x-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-600">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  
                  {/* Typing Indicator */}
                  <div className="flex flex-col">
                    <div className="px-4 py-3 rounded-2xl bg-white border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <span className="text-sm text-gray-500">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me to create a campaign for your connected data sources and channels..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-2 bottom-2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showDataSourceConnector && (
        <DataSourceConnector
          connectedSources={connectedDataSources}
          onClose={() => setShowDataSourceConnector(false)}
          onConnect={(sources) => setConnectedDataSources(sources)}
        />
      )}

      {showChannelSelector && (
        <ChannelSelector
          selectedChannels={selectedChannels}
          onClose={() => setShowChannelSelector(false)}
          onSelect={(channels) => setSelectedChannels(channels)}
        />
      )}
    </div>
  )
}
