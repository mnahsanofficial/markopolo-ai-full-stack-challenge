'use client'

import { useState } from 'react'
import { X, Check, MessageSquare, Mail, Smartphone, Bell } from 'lucide-react'
import { Channel } from '../types'

interface ChannelSelectorProps {
  selectedChannels: Channel[]
  onClose: () => void
  onSelect: (channels: Channel[]) => void
}

const availableChannels = [
  {
    id: 'email',
    name: 'Email',
    description: 'Send targeted email campaigns',
    icon: Mail,
    color: 'bg-blue-500',
    features: ['Personalization', 'A/B Testing', 'Automation'],
  },
  {
    id: 'sms',
    name: 'SMS',
    description: 'Reach customers via text messages',
    icon: Smartphone,
    color: 'bg-green-500',
    features: ['High Open Rates', 'Instant Delivery', 'Location-based'],
  },
  {
    id: 'push',
    name: 'Push Notifications',
    description: 'Engage users with mobile notifications',
    icon: Bell,
    color: 'bg-purple-500',
    features: ['Real-time', 'Rich Media', 'Behavioral Triggers'],
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Connect with customers on WhatsApp',
    icon: MessageSquare,
    color: 'bg-green-600',
    features: ['Rich Media', 'Two-way Chat', 'Global Reach'],
  },
]

export default function ChannelSelector({ 
  selectedChannels, 
  onClose, 
  onSelect 
}: ChannelSelectorProps) {
  const [tempSelection, setTempSelection] = useState<Channel[]>(selectedChannels)

  const handleToggleChannel = (channelId: string) => {
    const channel = availableChannels.find(c => c.id === channelId)
    if (!channel) return

    const isSelected = tempSelection.some(c => c.id === channelId)
    
    if (isSelected) {
      setTempSelection(prev => prev.filter(c => c.id !== channelId))
    } else {
      const newChannel: Channel = {
        id: channelId,
        name: channel.name,
        type: channelId as any,
        status: 'active',
        config: {
          enabled: true,
          priority: tempSelection.length + 1,
        }
      }
      setTempSelection(prev => [...prev, newChannel])
    }
  }

  const handleSave = () => {
    onSelect(tempSelection)
    onClose()
  }

  const isSelected = (channelId: string) => {
    return tempSelection.some(c => c.id === channelId)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Select Channels</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <p className="text-gray-600 mb-6">
            Choose the channels you want to use for your marketing campaigns. The AI will optimize content and timing for each selected channel.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableChannels.map((channel) => {
              const selected = isSelected(channel.id)
              const IconComponent = channel.icon

              return (
                <div
                  key={channel.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selected 
                      ? 'border-primary-200 bg-primary-50 ring-2 ring-primary-200' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleToggleChannel(channel.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${channel.color} rounded-lg flex items-center justify-center text-white`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{channel.name}</h3>
                        {selected && (
                          <Check className="w-4 h-4 text-primary-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{channel.description}</p>
                      
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {channel.features.map((feature, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {tempSelection.length > 0 && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Channels Selected</h4>
                  <p className="text-sm text-green-700 mt-1">
                    {tempSelection.length} channel(s) selected. The AI will create optimized campaigns for: {' '}
                    <span className="font-medium">
                      {tempSelection.map(c => c.name).join(', ')}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {tempSelection.length} channel(s) selected
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Save Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
