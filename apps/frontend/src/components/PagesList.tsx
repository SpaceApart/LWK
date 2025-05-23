'use client'

import { usePayload } from './PayloadDataProvider'

export function PagesList() {
  const { pages, loading, error, refetch } = usePayload()

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-300 rounded-lg h-48"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-red-800 mb-2">
          Błąd podczas ładowania stron
        </h2>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Spróbuj ponownie
        </button>
      </div>
    )
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-yellow-800 mb-2">
            Brak stron
          </h3>
          <p className="text-yellow-600">
            Utwórz pierwszą stronę w panelu Payload CMS
          </p>
          <a
            href="http://localhost:3000/admin"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Otwórz panel CMS
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {pages.map((page) => (
        <article key={page.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {page.title}
            </h2>
            
            <div className="text-sm text-gray-500 mb-3">
              <p>Slug: /{page.slug}</p>
              <p>Utworzono: {new Date(page.createdAt).toLocaleDateString('pl-PL')}</p>
              {page.publishedAt && (
                <p>Opublikowano: {new Date(page.publishedAt).toLocaleDateString('pl-PL')}</p>
              )}
            </div>
            
            {page.meta?.description && (
              <p className="text-gray-600 text-sm mb-4">
                {page.meta.description}
              </p>
            )}
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <a
                href={`/${page.slug}`}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Zobacz stronę →
              </a>
              <span className="text-xs text-gray-400">
                ID: {page.id}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
} 