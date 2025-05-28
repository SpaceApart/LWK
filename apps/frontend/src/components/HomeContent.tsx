'use client'

import { usePayload } from './PayloadDataProvider'

export function HomeContent() {
  const { pages, loading, error, refetch } = usePayload()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Błąd podczas ładowania danych
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Spróbuj ponownie
            </button>
          </div>
        </div>
      </div>
    )
  }

  const homePage = pages.find(page => page.slug === 'home') || pages[0]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {homePage?.title || 'Witaj w LWK'}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Frontend application powered by Payload CMS
          </p>
          <div className="bg-blue-100 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-blue-900 mb-2">
              🎉 Połączenie z Payload API działa!
            </h2>
            <p className="text-blue-700">
              Załadowano {pages.length} stron z Payload CMS
            </p>
          </div>
        </div>

        {/* Pages List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <div key={page.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {page.title}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                Slug: /{page.slug}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Utworzono: {new Date(page.createdAt).toLocaleDateString('pl-PL')}
              </p>
              {page.meta?.description && (
                <p className="text-gray-600 text-sm">
                  {page.meta.description}
                </p>
              )}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  href={`/${page.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Zobacz stronę →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {pages.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                Brak stron
              </h3>
              <p className="text-yellow-600">
                Utwórz pierwszą stronę w panelu Payload CMS
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 