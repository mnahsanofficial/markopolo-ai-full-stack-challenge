'use client'

import { Message } from '../types'
import { User, Bot, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary-600' : 'bg-gray-600'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-4 py-3 rounded-2xl max-w-full ${
            isUser 
              ? 'bg-primary-600 text-white' 
              : 'bg-white border border-gray-200 text-gray-900'
          }`}>
            {message.isStreaming ? (
              <div className="flex items-center space-x-2">
                <span>{message.content}</span>
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
              </div>
            ) : isUser ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '')
                      const language = match ? match[1] : ''
                      
                      if (!inline && language) {
                        return (
                          <div className="my-4">
                            <SyntaxHighlighter
                              style={oneDark}
                              language={language}
                              PreTag="div"
                              className="rounded-lg"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          </div>
                        )
                      }
                      
                      return (
                        <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
                          {children}
                        </code>
                      )
                    },
                    h1: ({ children }) => <h1 className="text-xl font-bold mb-2 text-gray-900">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-lg font-bold mb-2 text-gray-900">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-base font-bold mb-1 text-gray-900">{children}</h3>,
                    p: ({ children }) => <p className="mb-2 text-gray-800">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-800">{children}</li>,
                    strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                    em: ({ children }) => <em className="italic text-gray-800">{children}</em>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary-200 pl-4 italic text-gray-700 my-2">
                        {children}
                      </blockquote>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4">
                        <table className="min-w-full border border-gray-200 rounded-lg">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border border-gray-200 px-4 py-2 bg-gray-50 font-semibold text-left">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-gray-200 px-4 py-2">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
          
          {/* Timestamp and Actions */}
          <div className={`flex items-center space-x-2 mt-1 text-xs text-gray-500 ${
            isUser ? 'flex-row-reverse' : 'flex-row'
          }`}>
            <span>{formatTime(message.timestamp)}</span>
            {!isUser && !message.isStreaming && (
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
