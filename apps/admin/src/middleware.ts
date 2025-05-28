// Admin CMS nie potrzebuje lokalizacji na poziomie URL
// Payload CMS ma własny system lokalizacji
// Wyłączamy next-intl middleware dla aplikacji admin

export const config = {
  matcher: [],
}
