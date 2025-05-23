export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              LWK Frontend
            </h1>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a
              href="/"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Strona główna
            </a>
            <a
              href="/pages"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Strony
            </a>
            <a
              href="/posts"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Blog
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <a
              href="http://localhost:3000/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Panel CMS
            </a>
          </div>
        </div>
      </div>
    </header>
  )
} 