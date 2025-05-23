export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">LWK Frontend</h3>
            <p className="text-gray-400">
              Aplikacja frontend korzystająca z Payload CMS
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Linki</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  Strona główna
                </a>
              </li>
              <li>
                <a href="/pages" className="text-gray-400 hover:text-white transition-colors">
                  Strony
                </a>
              </li>
              <li>
                <a href="/posts" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">CMS</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="http://localhost:3000/admin" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Panel administracyjny
                </a>
              </li>
              <li>
                <a 
                  href="http://localhost:3000/api/pages" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  API - Strony
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 LWK. Zbudowane z Next.js i Payload CMS.
          </p>
        </div>
      </div>
    </footer>
  )
} 