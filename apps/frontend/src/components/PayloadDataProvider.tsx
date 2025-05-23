'use client'

import { fetchPages, PayloadPage } from '@/lib/payload-api'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface PayloadContextType {
  pages: PayloadPage[]
  loading: boolean
  error: string | null
  refetch: () => void
}

const PayloadContext = createContext<PayloadContextType | undefined>(undefined)

export function PayloadDataProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<PayloadPage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchPages()
      setPages(data.docs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const value = {
    pages,
    loading,
    error,
    refetch: fetchData,
  }

  return (
    <PayloadContext.Provider value={value}>
      {children}
    </PayloadContext.Provider>
  )
}

export function usePayload() {
  const context = useContext(PayloadContext)
  if (context === undefined) {
    throw new Error('usePayload must be used within a PayloadDataProvider')
  }
  return context
} 