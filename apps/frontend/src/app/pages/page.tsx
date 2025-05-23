import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PagesList } from '@/components/PagesList'
import { PayloadDataProvider } from '@/components/PayloadDataProvider'
import { Suspense } from 'react'

export default function PagesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Wszystkie strony
          </h1>
          
          <Suspense fallback={<div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>}>
            <PayloadDataProvider>
              <PagesList />
            </PayloadDataProvider>
          </Suspense>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 