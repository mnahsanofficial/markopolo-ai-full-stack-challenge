'use client'

import { useState } from 'react'
import { X, Check, AlertCircle, Database, ExternalLink } from 'lucide-react'
import { DataSource } from '../types'

interface DataSourceConnectorProps {
  connectedSources: DataSource[]
  onClose: () => void
  onConnect: (sources: DataSource[]) => void
}

const availableDataSources = [
  {
    id: 'gtm',
    name: 'Google Tag Manager',
    description: 'Track website interactions and user behavior',
    icon: '🏷️',
    color: 'bg-blue-500',
  },
  {
    id: 'facebook_pixel',
    name: 'Facebook Pixel',
    description: 'Track conversions and optimize Facebook ads',
    icon: '📘',
    color: 'bg-blue-600',
  },
  {
    id: 'google_ads_tag',
    name: 'Google Ads Tag',
    description: 'Track Google Ads performance and conversions',
    icon: '🎯',
    color: 'bg-green-500',
  },
]

export default function DataSourceConnector({ 
  connectedSources, 
  onClose, 
  onConnect 
}: DataSourceConnectorProps) {
  const [connecting, setConnecting] = useState<string | null>(null)

  const handleConnect = async (sourceId: string) => {
    setConnecting(sourceId)
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newSource: DataSource = {
      id: sourceId,
      name: availableDataSources.find(s => s.id === sourceId)?.name || '',
      type: sourceId as any,
      status: 'connected',
      lastSync: new Date(),
      config: {
        connected: true,
        lastSync: new Date().toISOString(),
      }
    }
    
    const updatedSources = [...connectedSources.filter(s => s.id !== sourceId), newSource]
    onConnect(updatedSources)
    setConnecting(null)
  }

  const handleDisconnect = (sourceId: string) => {
    const updatedSources = connectedSources.filter(s => s.id !== sourceId)
    onConnect(updatedSources)
  }

  const isConnected = (sourceId: string) => {
    return connectedSources.some(s => s.id === sourceId && s.status === 'connected')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Connect Data Sources</h2>
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
            Connect your data sources to enable AI-powered campaign recommendations based on your actual data.
          </p>

          <div className="space-y-4">
            {availableDataSources.map((source) => {
              const connected = isConnected(source.id)
              const isConnecting = connecting === source.id

              return (
                <div
                  key={source.id}
                  className={`border rounded-lg p-4 transition-all ${
                    connected 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${source.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                        {source.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{source.name}</h3>
                        <p className="text-sm text-gray-600">{source.description}</p>
                        {connected && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-600">Connected</span>
                            <span className="text-xs text-gray-500">
                              • Last sync: {connectedSources.find(s => s.id === source.id)?.lastSync?.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {connected ? (
                        <button
                          onClick={() => handleDisconnect(source.id)}
                          className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Disconnect
                        </button>
                      ) : (
                        <button
                          onClick={() => handleConnect(source.id)}
                          disabled={isConnecting}
                          className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                        >
                          {isConnecting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Connecting...</span>
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-4 h-4" />
                              <span>Connect</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {connectedSources.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Data Sources Connected</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your AI assistant now has access to data from {connectedSources.length} source(s). 
                    This enables more accurate campaign recommendations and audience targeting.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
