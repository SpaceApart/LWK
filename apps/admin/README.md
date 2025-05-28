# Payload Localization Example (i18n)

This example is built based on an old version of the website template.

The objective is to show how to implement localization in a website. There is no guarantee that it will be kept up to date with the website template or the latest Payload enhancements.

To facilitate the localization process, this example uses the next-intl library.

## Setup

1. Run the following command to create a project from the example:

- `npx create-payload-app --example localization`

2. `cp .env.example .env` (copy the .env.example file to .env)
3. `pnpm install`
4. `pnpm run dev`
5. Seed your database in the admin panel (see below)

## Seed

To seed the database with a few pages, posts, and projects you can click the 'seed database' link from the admin panel.

The seed script will also create a demo user for demonstration purposes only:

- Demo Author
  - Email: `demo-author@payloadcms.com`
  - Password: `password`

> NOTICE: seeding the database is destructive because it drops your current database to populate a fresh one from the seed template. Only run this command if you are starting a new project or can afford to lose your current data.

## Important!

The seed script only creates translations in English and Spanish, so you will not see the website translated to other languages even if you see them in the dropdown menu.

You can translate documents to other languages from the admin panel.

# Admin Panel - Payload CMS

Panel administracyjny oparty na Payload CMS do zarządzania treścią turystyczną LWK.

## Funkcjonalności

### Zarządzanie Stanem Nawigacji

Aplikacja zawiera system automatycznego zarządzania stanem nawigacji, który:

- **Automatycznie rozwijane grupy**: Wszystkie grupy nawigacji są domyślnie rozwinięte przy pierwszej wizycie
- **Zapamiętywanie stanu**: Stan rozwinięcia/zwinięcia grup jest zapisywany w localStorage
- **Trwałość między sesjami**: Stan jest przywracany po odświeżeniu strony i ponownym logowaniu
- **Kompatybilność**: Działa z różnymi selektorami CSS używanymi przez Payload CMS

#### Implementacja

**Komponenty:**
- `NavigationStateManager` - Główny komponent zarządzający stanem nawigacji
- `useNavigationState` - Hook zawierający logikę zarządzania stanem

**Kluczowe funkcje:**
- `saveNavigationState()` - Zapisuje aktualny stan nawigacji do localStorage
- `restoreNavigationState()` - Przywraca zapisany stan nawigacji
- `setDefaultExpandedState()` - Ustawia wszystkie grupy jako rozwinięte (domyślnie)

**Konfiguracja:**
Komponent jest automatycznie włączony w `payload.config.ts`:

```typescript
admin: {
  components: {
    afterDashboard: ['@/components/AfterDashboard', '@/components/NavigationStateManager'],
  },
}
```

## Struktura Projektu

```
src/
├── collections/           # Definicje kolekcji CMS
├── components/           # Komponenty React
│   ├── NavigationStateManager/  # Zarządzanie stanem nawigacji
│   └── ...
├── hooks/               # Custom hooks
│   ├── useNavigationState.ts   # Hook do zarządzania nawigacją
│   └── ...
├── globals/            # Globalne konfiguracje
└── ...
```

## Kolekcje CMS

### Turystyczne
- **Attractions** - Atrakcje turystyczne
- **Experiences** - Doświadczenia turystyczne  
- **Locations** - Lokalizacje geograficzne
- **Offers** - Oferty specjalne
- **Photos** - Galeria zdjęć

### Treść
- **Pages** - Strony CMS
- **Posts** - Posty bloga
- **Media** - Pliki mediów

### System
- **Users** - Zarządzanie użytkownikami
- **Tags** - System tagów

## Development

### Uruchamianie

```bash
# Development
pnpm dev

# Build
pnpm build

# Testy
pnpm test
pnpm test:watch
pnpm test:coverage
```

### Testy

Projekt zawiera testy jednostkowe dla:
- Hook `useNavigationState` - testuje logikę zarządzania stanem
- Komponent `NavigationStateManager` - testuje obsługę zdarzeń DOM

```bash
# Uruchom wszystkie testy
pnpm test

# Testy w trybie watch
pnpm test:watch

# Testy z pokryciem kodu
pnpm test:coverage
```

### Generowanie Typów

Po zmianach w kolekcjach Payload CMS:

```bash
pnpm generate:types
```

## Konfiguracja

### Environment Variables

```env
DATABASE_URI=postgresql://...
PAYLOAD_SECRET=your-secret-key
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### Nawigacja

Grupy nawigacji są skonfigurowane w `payload.config.ts`:

```typescript
nav: {
  groups: [
    {
      label: 'Content',
      fields: ['pages', 'posts', 'media'],
    },
    {
      label: 'Tourism', 
      fields: ['offers', 'attractions', 'experiences', 'photos', 'locations'],
    },
    {
      label: 'System',
      fields: ['categories', 'tags', 'users'],
    },
  ],
}
```

## Technologie

- **Framework**: Next.js 15 (App Router)
- **CMS**: Payload CMS 3.0
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library
- **Language**: TypeScript
