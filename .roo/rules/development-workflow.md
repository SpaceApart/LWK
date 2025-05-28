---
description: 
globs: 
alwaysApply: true
---
# Workflow Rozwoju LWK

## Uruchamianie Środowiska Deweloperskiego

### Wszystkie Aplikacje
```bash
# Uruchom wszystkie aplikacje w trybie dev
pnpm dev
```

### Pojedyncze Aplikacje
```bash
# Admin Panel (Payload CMS)
cd apps/admin && pnpm dev

# Dashboard
cd apps/dashboard && pnpm dev

# Frontend
cd apps/frontend && pnpm dev
```

## Struktura Pracy z Kodem

### 1. Payload CMS (Admin)
- **Port**: Domyślnie 3000
- **Główne pliki**:
  - Kolekcje: [apps/admin/src/collections/](mdc:apps/admin/src/collections)
  - Bloki: [apps/admin/src/blocks/](mdc:apps/admin/src/blocks)
  - Komponenty: [apps/admin/src/components/](mdc:apps/admin/src/components)

### 2. Dashboard
- **Port**: Domyślnie 3001
- **Główne katalogi**:
  - Strony: [apps/dashboard/src/app/](mdc:apps/dashboard/src/app)
  - Funkcjonalności: [apps/dashboard/src/features/](mdc:apps/dashboard/src/features)
  - Komponenty UI: [apps/dashboard/src/components/ui/](mdc:apps/dashboard/src/components/ui)

### 3. Frontend
- **Port**: Domyślnie 3002
- **Główne katalogi**:
  - Strony: [apps/frontend/src/app/](mdc:apps/frontend/src/app)
  - Komponenty: [apps/frontend/src/components/](mdc:apps/frontend/src/components)

## Generowanie Typów

```bash
# Generuj typy dla wszystkich aplikacji
pnpm generate:types

# Synchronizuj typy między pakietami
pnpm types:sync
```

## Linting i Formatowanie

```bash
# Lint wszystkich aplikacji
pnpm lint

# Formatowanie kodu
pnpm format
```

## Budowanie

```bash
# Zbuduj wszystkie aplikacje
pnpm build

# Zbuduj konkretną aplikację
cd apps/admin && pnpm build
cd apps/dashboard && pnpm build
cd apps/frontend && pnpm build
```

## Praca z Pakietami

### Dodawanie Zależności

```bash
# Do konkretnej aplikacji
cd apps/dashboard && pnpm add package-name

# Do pakietu współdzielonego
cd packages/ui && pnpm add package-name

# Workspace dependency
pnpm add @lwk/ui --filter @lwk/dashboard
```

### Współdzielone Pakiety

- **@lwk/types**: Typy TypeScript
- **@lwk/ui**: Komponenty UI
- **@lwk/api-client**: Klient API

## Debugowanie

### Next.js Apps
- Użyj `console.log` lub debuggera VS Code
- Hot reload jest włączony domyślnie

### Payload CMS
- Panel admin dostępny pod `/admin`
- API dostępne pod `/api`

## Najlepsze Praktyki

1. **Zawsze uruchamiaj `pnpm generate:types` po zmianach w Payload CMS**
2. **Używaj workspace dependencies dla pakietów wewnętrznych**
3. **Testuj zmiany we wszystkich aplikacjach przed commitem**
4. **Używaj Turbo cache dla szybszych buildów**

## Rozwiązywanie Problemów

### Cache Issues
```bash
# Wyczyść cache Turbo
pnpm clean

# Wyczyść node_modules
rm -rf node_modules && pnpm install
```

### Type Issues
```bash
# Regeneruj typy
pnpm generate:types
```

