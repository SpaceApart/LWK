---
description: 
globs: 
alwaysApply: true
---
# Frontend - Aplikacja Turystyczna

Frontend to aplikacja Next.js 14+ z App Router, służąca jako główna strona turystyczna dla użytkowników końcowych.

## Struktura Katalogów

### App Router ([apps/frontend/src/app/](mdc:apps/frontend/src/app))

```
app/
├── [slug]/              # Dynamic routing dla stron CMS
│   └── page.tsx        # Renderowanie stron z Payload CMS
├── pages/              # Statyczne strony
└── layout.tsx          # Root layout
```

### Komponenty ([apps/frontend/src/components/](mdc:apps/frontend/src/components))

```
components/
├── blocks/             # Komponenty bloków z Payload CMS
├── layout/            # Komponenty layoutu
├── ui/                # Komponenty UI
└── shared/            # Współdzielone komponenty
```

### Lib ([apps/frontend/src/lib/](mdc:apps/frontend/src/lib))

```
lib/
├── payload.ts         # Konfiguracja Payload client
├── utils.ts           # Utilities
└── constants.ts       # Stałe aplikacji
```

## Integracja z Payload CMS

### Dynamic Routing

Aplikacja używa `[slug]` routing do renderowania stron z CMS:

```typescript
// app/[slug]/page.tsx
export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug)
  return <PageRenderer page={page} />
}
```

### Bloki Treści

Frontend renderuje bloki zdefiniowane w Payload CMS:

- **Content Block** - Treść tekstowa z Rich Text
- **Media Block** - Obrazy i wideo
- **Banner Block** - Banery promocyjne
- **CTA Block** - Call-to-action
- **Archive Block** - Listy treści
- **Related Posts** - Powiązane posty

### API Integration

```typescript
// Pobieranie danych z Payload CMS
const experiences = await payload.find({
  collection: 'experiences',
  where: {
    status: { equals: 'published' }
  }
})
```

## Kolekcje Turystyczne

### Experiences (Doświadczenia)
- Główne doświadczenia turystyczne
- Galerie zdjęć
- Opisy i szczegóły
- Ceny i dostępność

### Attractions (Atrakcje)
- Lokalne atrakcje
- Informacje praktyczne
- Zdjęcia i opisy

### Locations (Lokalizacje)
- Miasta i regiony
- Mapy i współrzędne
- Informacje turystyczne

### Offers (Oferty)
- Promocje i pakiety
- Ceny specjalne
- Ograniczenia czasowe

## Funkcjonalności

### SEO i Metadata
```typescript
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug)
  return {
    title: page.meta?.title || page.title,
    description: page.meta?.description,
    openGraph: {
      images: page.meta?.image ? [page.meta.image.url] : []
    }
  }
}
```

### Static Generation
```typescript
export async function generateStaticParams() {
  const pages = await payload.find({
    collection: 'pages',
    limit: 1000
  })
  
  return pages.docs.map(page => ({
    slug: page.slug
  }))
}
```

### Image Optimization
- Next.js Image component
- Responsive images
- Lazy loading
- WebP support

## Styling

### Tailwind CSS
- Utility-first CSS framework
- Responsive design
- Dark mode support
- Custom design system

### Komponenty UI
- Współdzielone z @lwk/ui
- Consistent design language
- Accessibility features

## Performance

### Next.js Optimizations
- App Router dla lepszej performance
- Server Components domyślnie
- Streaming i Suspense
- Image optimization

### Caching Strategy
```typescript
// ISR dla stron CMS
export const revalidate = 3600 // 1 godzina

// On-demand revalidation z Payload webhooks
export async function POST(request: Request) {
  const { slug } = await request.json()
  revalidatePath(`/${slug}`)
  return Response.json({ revalidated: true })
}
```

## Internationalization (i18n)

### Multi-language Support
- Payload CMS localization
- Next.js i18n routing
- Translated content blocks

```typescript
// Pobieranie treści w konkretnym języku
const page = await payload.findByID({
  collection: 'pages',
  id: pageId,
  locale: 'pl' // lub 'en'
})
```

## Search i Filtering

### Search Functionality
- Full-text search_files w Payload CMS
- Filtering po kategoriach
- Geolocation search_files

### Faceted Search
```typescript
const searchResults = await payload.find({
  collection: 'experiences',
  where: {
    and: [
      { title: { contains: query } },
      { location: { equals: locationId } },
      { price: { less_than: maxPrice } }
    ]
  }
})
```

## Development

### Scripts
```bash
# Development
pnpm dev

# Build
pnpm build

# Start production
pnpm start
```

### Environment Variables
```env
PAYLOAD_SECRET=your-secret
DATABASE_URI=your-database-url
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000
```

## Deployment

### Vercel Deployment
- Automatic deployments z Git
- Edge functions
- Image optimization
- Analytics

### Build Optimization
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-cms-domain.com'],
    formats: ['image/webp', 'image/avif']
  },
  experimental: {
    ppr: true // Partial Prerendering
  }
}
```

## Monitoring

### Analytics
- Vercel Analytics
- Google Analytics
- Performance monitoring

### Error Tracking
- Sentry integration
- Error boundaries
- Logging strategy

