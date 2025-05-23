import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { fetchPageBySlug } from '@/lib/payload-api'
import { notFound } from 'next/navigation'

interface PageProps {
  params: { slug: string }
}

export default async function DynamicPage({ params }: PageProps) {
  const page = await fetchPageBySlug(params.slug)

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <article className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {page.title}
              </h1>
              
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <span>Slug: /{page.slug}</span>
                <span>•</span>
                <span>
                  Utworzono: {new Date(page.createdAt).toLocaleDateString('pl-PL')}
                </span>
                {page.publishedAt && (
                  <>
                    <span>•</span>
                    <span>
                      Opublikowano: {new Date(page.publishedAt).toLocaleDateString('pl-PL')}
                    </span>
                  </>
                )}
              </div>
            </header>
            
            <div className="prose max-w-none">
              {page.meta?.description && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
                  <p className="text-blue-700">{page.meta.description}</p>
                </div>
              )}
              
              {page.content ? (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Zawartość strony:</h3>
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                    {JSON.stringify(page.content, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <p className="text-yellow-800">
                    Ta strona nie ma jeszcze treści. Dodaj zawartość w panelu CMS.
                  </p>
                  <a
                    href={`http://localhost:3000/admin/collections/pages/${page.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Edytuj w CMS
                  </a>
                </div>
              )}
            </div>
          </article>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export async function generateStaticParams() {
  // W przyszłości można tutaj pobrać wszystkie slug'i dla pre-renderingu
  return []
} 