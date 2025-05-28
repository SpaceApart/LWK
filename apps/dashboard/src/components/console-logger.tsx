'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
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
      if (typeof window !== 'undefined' && window.getDashboardLogs) {
        const currentLogs = window.getDashboardLogs()
        setLogs(currentLogs)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const clearLogs = () => {
    if (typeof window !== 'undefined' && window.clearDashboardLogs) {
      window.clearDashboardLogs()
      setLogs([])
    }
  }

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'destructive'
      case 'warn':
        return 'secondary'
      case 'info':
        return 'default'
      default:
        return 'outline'
    }
  }

  const exportLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `dashboard-logs-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50"
        variant="outline"
      >
        Pokaż logi konsoli ({logs.length})
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-96 z-50 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Logi konsoli Dashboard</CardTitle>
          <div className="flex gap-2">
            <Button onClick={exportLogs} size="sm" variant="outline">
              Eksportuj
            </Button>
            <Button onClick={clearLogs} size="sm" variant="outline">
              Wyczyść
            </Button>
            <Button onClick={() => setIsVisible(false)} size="sm" variant="outline">
              ×
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <ScrollArea className="h-80">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Brak logów</p>
          ) : (
            <div className="space-y-2">
              {logs.map((log, index) => (
                <div key={index} className="text-xs border-b pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getLogTypeColor(log.type)} className="text-xs">
                      {log.type}
                    </Badge>
                    <span className="text-muted-foreground">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="whitespace-pre-wrap break-words text-xs">
                    {log.message}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Rozszerzenie typu Window
declare global {
  interface Window {
    getDashboardLogs: () => LogEntry[]
    clearDashboardLogs: () => void
  }
} 