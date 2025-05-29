'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestLogsPage() {
  const generateLog = () => {
    console.log('Test log message from dashboard', { timestamp: new Date(), data: 'sample data' })
  }

  const generateError = () => {
    console.error('Test error message from dashboard', new Error('Sample error'))
  }

  const generateWarn = () => {
    console.warn('Test warning message from dashboard', { warning: 'This is a warning' })
  }

  const generateInfo = () => {
    console.info('Test info message from dashboard', { info: 'This is information' })
  }

  const generateMultiple = () => {
    console.log('Starting multiple log generation...')
    setTimeout(() => console.info('Info after 1 second'), 1000)
    setTimeout(() => console.warn('Warning after 2 seconds'), 2000)
    setTimeout(() => console.error('Error after 3 seconds'), 3000)
    setTimeout(() => console.log('Final log after 4 seconds'), 4000)
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Logów Konsoli Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={generateLog} variant="default">
              Generuj Log
            </Button>
            <Button onClick={generateError} variant="destructive">
              Generuj Error
            </Button>
            <Button onClick={generateWarn} variant="secondary">
              Generuj Warning
            </Button>
            <Button onClick={generateInfo} variant="outline">
              Generuj Info
            </Button>
          </div>
          <Button onClick={generateMultiple} className="w-full" variant="default">
            Generuj Serię Logów (4 sekundy)
          </Button>
          <div className="text-sm text-muted-foreground">
            <p>Kliknij przyciski powyżej, aby wygenerować różne typy logów konsoli.</p>
            <p>Sprawdź przycisk &quot;Pokaż logi konsoli&quot; w prawym dolnym rogu strony.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 