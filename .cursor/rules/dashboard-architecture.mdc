---
description: 
globs: 
alwaysApply: true
---
# Architektura Dashboard LWK

Dashboard to aplikacja Next.js 14+ z App Router, wykorzystująca Clerk do autentykacji i Radix UI do komponentów.

## Struktura Katalogów

### App Router ([apps/dashboard/src/app/](mdc:apps/dashboard/src/app))

```
app/
├── api/                    # API routes
│   ├── payload/           # Integracja z Payload CMS
│   └── ...
├── auth/                  # Strony autentykacji Clerk
│   ├── sign-in/
│   └── sign-up/
├── dashboard/             # Główne strony dashboard
│   ├── overview/          # Strona główna z statystykami
│   │   ├── @area_stats/   # Parallel route - wykresy obszarowe
│   │   ├── @bar_stats/    # Parallel route - wykresy słupkowe
│   │   ├── @pie_stats/    # Parallel route - wykresy kołowe
│   │   └── @sales/        # Parallel route - statystyki sprzedaży
│   ├── integrations/      # Strona integracji
│   ├── kanban/           # Tablica Kanban
│   ├── product/          # Zarządzanie produktami
│   └── profile/          # Profil użytkownika
└── experiences/          # Zarządzanie doświadczeniami
```

### Features ([apps/dashboard/src/features/](mdc:apps/dashboard/src/features))

Aplikacja używa architektury feature-based:

- **auth/**: Komponenty i hooki autentykacji
- **experiences/**: Zarządzanie doświadczeniami turystycznymi
- **kanban/**: Funkcjonalność tablicy Kanban
- **overview/**: Komponenty dashboard overview
- **products/**: Zarządzanie produktami
- **profile/**: Zarządzanie profilem użytkownika

### Komponenty ([apps/dashboard/src/components/](mdc:apps/dashboard/src/components))

```
components/
├── kbar/                  # Command palette
├── layout/               # Komponenty layoutu
│   └── ThemeToggle/      # Przełącznik motywu
├── modal/                # Komponenty modali
└── ui/                   # Komponenty UI (Radix + shadcn/ui)
    └── table/            # Komponenty tabel
```

## Kluczowe Technologie

### Autentykacja - Clerk
- **Konfiguracja**: Middleware w [apps/dashboard/middleware.ts](mdc:apps/dashboard/middleware.ts)
- **Komponenty**: `@clerk/nextjs`
- **Strony**: `/auth/sign-in`, `/auth/sign-up`

### UI Components - Radix UI
- **Base**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Icons**: Radix Icons

### State Management
- **Server State**: React Query (TanStack Query)
- **Client State**: React hooks + Context

### Drag & Drop - DND Kit
- **Kanban**: `@dnd-kit/core`, `@dnd-kit/sortable`
- **Modifiers**: `@dnd-kit/modifiers`

## Parallel Routes (Overview)

Dashboard overview używa parallel routes dla lepszej UX:

- `@area_stats` - Wykresy obszarowe
- `@bar_stats` - Wykresy słupkowe  
- `@pie_stats` - Wykresy kołowe
- `@sales` - Statystyki sprzedaży

Każdy route może być ładowany niezależnie.

## API Integration

### Payload CMS Integration
- **Endpoint**: `/api/payload/*`
- **Sync**: `/api/sync-user` - synchronizacja użytkowników
- **Dashboard User**: `/api/dashboard-user`

### Experience API
- **Endpoint**: `/api/experience`
- **CRUD**: Operacje na doświadczeniach turystycznych

## Hooki i Utilities

### Custom Hooks ([apps/dashboard/src/hooks/](mdc:apps/dashboard/src/hooks))
- Hooki do zarządzania stanem aplikacji
- Integracja z API

### Lib ([apps/dashboard/src/lib/](mdc:apps/dashboard/src/lib))
- Utilities i helpery
- Konfiguracja bibliotek zewnętrznych

## Routing i Navigation

### Protected Routes
Wszystkie strony dashboard są chronione przez Clerk middleware.

### Navigation Structure
```
/dashboard
├── /overview          # Strona główna
├── /integrations      # Integracje
├── /kanban           # Tablica Kanban
├── /product/[id]     # Szczegóły produktu
└── /profile          # Profil użytkownika
```

## Styling

### Tailwind CSS
- **Config**: [apps/dashboard/tailwind.config.js](mdc:apps/dashboard/tailwind.config.js)
- **Globals**: [apps/dashboard/src/app/globals.css](mdc:apps/dashboard/src/app/globals.css)

### Theme System
- Dark/Light mode support
- CSS variables dla kolorów
- Responsive design

## Development

### Scripts
```bash
# Development
pnpm dev

# Build
pnpm build

# Lint
pnpm lint
pnpm lint:fix
```

### Environment Variables
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- Inne zmienne w `.env.local`

