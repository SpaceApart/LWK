---
description: 
globs: 
alwaysApply: true
---
# Admin Panel - Payload CMS

Aplikacja admin to panel administracyjny oparty na Payload CMS do zarządzania treścią turystyczną.

## Struktura Katalogów

### Główne Katalogi ([apps/admin/src/](mdc:apps/admin/src))

```
src/
├── collections/           # Definicje kolekcji CMS
│   ├── Attractions/      # Atrakcje turystyczne
│   ├── Experiences/      # Doświadczenia
│   ├── Locations/        # Lokalizacje
│   ├── Offers/          # Oferty
│   ├── Pages/           # Strony CMS
│   ├── Photos/          # Zdjęcia
│   ├── Posts/           # Posty bloga
│   ├── Tags/            # Tagi
│   └── Users/           # Użytkownicy
├── blocks/              # Bloki treści
├── components/          # Komponenty React
├── globals/            # Globalne konfiguracje
├── fields/             # Niestandardowe pola
├── hooks/              # Hooki Payload
└── utilities/          # Narzędzia pomocnicze
```

## Kolekcje CMS

### Turystyczne
- **Attractions** ([apps/admin/src/collections/Attractions/](mdc:apps/admin/src/collections/Attractions)) - Atrakcje turystyczne
- **Experiences** ([apps/admin/src/collections/Experiences/](mdc:apps/admin/src/collections/Experiences)) - Doświadczenia turystyczne
- **Locations** ([apps/admin/src/collections/Locations/](mdc:apps/admin/src/collections/Locations)) - Lokalizacje geograficzne
- **Offers** ([apps/admin/src/collections/Offers/](mdc:apps/admin/src/collections/Offers)) - Oferty specjalne

### Treść
- **Pages** ([apps/admin/src/collections/Pages/](mdc:apps/admin/src/collections/Pages)) - Strony CMS z hookami
- **Posts** ([apps/admin/src/collections/Posts/](mdc:apps/admin/src/collections/Posts)) - Posty bloga z hookami
- **Photos** ([apps/admin/src/collections/Photos/](mdc:apps/admin/src/collections/Photos)) - Galeria zdjęć

### System
- **Users** ([apps/admin/src/collections/Users/](mdc:apps/admin/src/collections/Users)) - Zarządzanie użytkownikami
- **Tags** ([apps/admin/src/collections/Tags/](mdc:apps/admin/src/collections/Tags)) - System tagów

## Bloki Treści ([apps/admin/src/blocks/](mdc:apps/admin/src/blocks))

### Podstawowe Bloki
- **Content** - Blok treści tekstowej z Rich Text
- **MediaBlock** - Blok mediów (zdjęcia, wideo)
- **Banner** - Banery promocyjne
- **CallToAction** - Przyciski CTA

### Zaawansowane Bloki
- **ArchiveBlock** - Archiwum postów/treści
- **RelatedPosts** - Powiązane posty
- **Code** - Bloki kodu

### Formularze ([apps/admin/src/blocks/Form/](mdc:apps/admin/src/blocks/Form))
```
Form/
├── Checkbox/            # Pola checkbox
├── Country/            # Wybór kraju
├── Email/              # Pola email
├── Error/              # Obsługa błędów
├── Message/            # Wiadomości
├── Number/             # Pola numeryczne
├── Select/             # Listy wyboru
├── State/              # Wybór stanu/województwa
├── Text/               # Pola tekstowe
├── Textarea/           # Obszary tekstowe
└── Width/              # Kontrola szerokości
```

## Komponenty ([apps/admin/src/components/](mdc:apps/admin/src/components))

### Główne Komponenty
- **AfterDashboard** - Komponenty po zalogowaniu
- **BeforeLogin** - Komponenty przed logowaniem
- **Card** - Komponenty kart
- **CollectionArchive** - Archiwum kolekcji
- **Link** - Komponenty linków
- **LivePreviewListener** - Podgląd na żywo
- **LocationPicker** - Wybór lokalizacji
- **Logo** - Logo aplikacji
- **PageRange** - Paginacja
- **Pagination** - Komponenty stronicowania
- **PayloadRedirects** - Przekierowania
- **RichText** - Edytor tekstu

### Media Components ([apps/admin/src/components/Media/](mdc:apps/admin/src/components/Media))
- **ImageMedia** - Komponenty obrazów
- **VideoMedia** - Komponenty wideo

### UI Components ([apps/admin/src/components/ui/](mdc:apps/admin/src/components/ui))
- Współdzielone komponenty UI

## Globalne Konfiguracje ([apps/admin/src/globals/](mdc:apps/admin/src/globals))

### Header ([apps/admin/src/globals/Header/](mdc:apps/admin/src/globals/Header))
- Konfiguracja nagłówka z hookami
- **Nav** - Komponenty nawigacji

### Footer ([apps/admin/src/globals/Footer/](mdc:apps/admin/src/globals/Footer))
- Konfiguracja stopki z hookami

## Hero Sections ([apps/admin/src/heros/](mdc:apps/admin/src/heros))
- **HighImpact** - Hero o wysokim wpływie
- **LowImpact** - Hero o niskim wpływie  
- **MediumImpact** - Hero o średnim wpływie
- **PostHero** - Hero dla postów

## Hooki Payload ([apps/admin/src/hooks/](mdc:apps/admin/src/hooks))
- Niestandardowe hooki dla Payload CMS
- Logika biznesowa i walidacja

## Pola Niestandardowe ([apps/admin/src/fields/](mdc:apps/admin/src/fields))
- **slug** - Generowanie slug-ów

## Providers ([apps/admin/src/providers/](mdc:apps/admin/src/providers))
- **HeaderTheme** - Zarządzanie motywem nagłówka
- **Theme** - System motywów
  - **InitTheme** - Inicjalizacja motywu
  - **ThemeSelector** - Wybór motywu

## API i Endpoints

### Endpoints ([apps/admin/src/endpoints/](mdc:apps/admin/src/endpoints))
- **seed** - Endpoint do seedowania danych

### API Routes
- `/admin` - Panel administracyjny
- `/api` - API Payload CMS
- `/api/graphql` - GraphQL endpoint
- `/api/graphql-playground` - GraphQL Playground

## Konfiguracja

### Główny Config
- Plik konfiguracyjny Payload w root aplikacji
- Definicje kolekcji, bloków i globalnych ustawień

### Migracje ([apps/admin/src/migrations/](mdc:apps/admin/src/migrations))
- Migracje bazy danych

### Internacjonalizacja ([apps/admin/src/i18n/](mdc:apps/admin/src/i18n))
- **messages** - Tłumaczenia

### Wyszukiwanie ([apps/admin/src/search_files/](mdc:apps/admin/src/search_files))
- Konfiguracja wyszukiwania

### Utilities ([apps/admin/src/utilities/](mdc:apps/admin/src/utilities))
- Funkcje pomocnicze

## Development

### Scripts
```bash
# Development
pnpm dev

# Build  
pnpm build

# Payload CLI
pnpm payload

# Generate types
pnpm generate:types
```

### Generowanie Typów
Po każdej zmianie w kolekcjach uruchom:
```bash
pnpm generate:types
```

Typy są generowane do `packages/types/src/payload-types.ts`

