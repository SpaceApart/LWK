'use client'

import { useEffect, useState } from 'react'

interface LogEntry {
  timestamp: string
  type: 'log' | 'error' | 'warn' | 'info'
  message: string
}

export function ConsoleLogger() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== 'undefined' && window.getAdminLogs) {
        const currentLogs = window.getAdminLogs()
        setLogs(currentLogs)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const clearLogs = () => {
    if (typeof window !== 'undefined' && window.clearAdminLogs) {
      window.clearAdminLogs()
      setLogs([])
    }
  }

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'error':
        return '#ef4444'
      case 'warn':
        return '#f59e0b'
      case 'info':
        return '#3b82f6'
      default:
        return '#6b7280'
    }
  }

  const exportLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `admin-logs-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 9999,
          padding: '8px 16px',
          backgroundColor: '#f3f4f6',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        Pokaż logi konsoli ({logs.length})
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '16px',
      right: '16px',
      width: '400px',
      height: '400px',
      zIndex: 9999,
      backgroundColor: 'white',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        padding: '12px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
          Logi konsoli Admin Panel
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={exportLogs}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            Eksportuj
          </button>
          <button
            onClick={clearLogs}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            Wyczyść
          </button>
          <button
            onClick={() => setIsVisible(false)}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
      </div>
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '8px'
      }}>
        {logs.length === 0 ? (
          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Brak logów</p>
        ) : (
          <div>
            {logs.map((log, index) => (
              <div key={index} style={{
                fontSize: '11px',
                borderBottom: '1px solid #f3f4f6',
                paddingBottom: '8px',
                marginBottom: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px'
                }}>
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    backgroundColor: getLogTypeColor(log.type),
                    color: 'white'
                  }}>
                    {log.type}
                  </span>
                  <span style={{ color: '#6b7280' }}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontSize: '11px',
                  margin: 0,
                  fontFamily: 'monospace'
                }}>
                  {log.message}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Rozszerzenie typu Window
declare global {
  interface Window {
    getAdminLogs: () => LogEntry[]
    clearAdminLogs: () => void
  }
} 