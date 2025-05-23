import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Strona nie została znaleziona
          </h2>
          <p className="text-gray-600 mb-8">
            Przepraszamy, nie możemy znaleźć strony, której szukasz.
          </p>
          <div className="space-x-4">
            <a
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Wróć do strony głównej
            </a>
            <a
              href="/pages"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Zobacz wszystkie strony
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 