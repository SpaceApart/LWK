import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { HomeContent } from '@/components/HomeContent'
import { PayloadDataProvider } from '@/components/PayloadDataProvider'
import { Suspense } from 'react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>}>
          <PayloadDataProvider>
            <HomeContent />
          </PayloadDataProvider>
        </Suspense>
      </main>
      
      <Footer />
    </div>
  )
} 