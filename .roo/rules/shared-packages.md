---
description: 
globs: 
alwaysApply: true
---
# Współdzielone Pakiety LWK

Monorepo LWK zawiera kilka współdzielonych pakietów, które są używane przez różne aplikacje.

## Struktura Pakietów

### @lwk/types ([packages/types/](mdc:packages/types))

**Opis**: Centralne miejsce dla wszystkich typów TypeScript w projekcie.

**Konfiguracja**: [packages/types/package.json](mdc:packages/types/package.json)

**Główne pliki**:
- `src/payload-types.ts` - Typy generowane z Payload CMS
- `src/index.ts` - Eksportowane typy

**Scripts**:
```bash
# Budowanie typów
pnpm build:types

# Synchronizacja typów
pnpm sync:types
```

**Użycie w aplikacjach**:
```typescript
import type { User, Post, Experience } from '@lwk/types'
```

### @lwk/ui ([packages/ui/](mdc:packages/ui))

**Opis**: Biblioteka współdzielonych komponentów UI opartych na React i Tailwind CSS.

**Konfiguracja**: [packages/ui/package.json](mdc:packages/ui/package.json)

**Zależności**:
- React 19
- Tailwind CSS utilities (clsx, tailwind-merge)
- @lwk/types

**Struktura**:
```
src/
├── lib/                 # Utilities i helpery
├── components/          # Komponenty React
└── index.ts            # Główny export
```

**Użycie w aplikacjach**:
```typescript
import { Button, Card, Modal } from '@lwk/ui'
```

### @lwk/api-client ([packages/api-client/](mdc:packages/api-client))

**Opis**: Klient API do komunikacji z backendem Payload CMS i innymi serwisami.

**Konfiguracja**: [packages/api-client/package.json](mdc:packages/api-client/package.json)

**Zależności**:
- @lwk/types

**Główne funkcjonalności**:
- HTTP client dla Payload CMS API
- Typowane endpointy
- Error handling
- Request/Response interceptors

**Użycie w aplikacjach**:
```typescript
import { payloadClient, experienceApi } from '@lwk/api-client'
```

### @lwk/payload ([packages/payload/](mdc:packages/payload))

**Opis**: Konfiguracja i rozszerzenia dla Payload CMS.

**Główne funkcjonalności**:
- Współdzielone konfiguracje Payload
- Niestandardowe pola i komponenty
- Hooki i utilities dla CMS
- Pluginy i rozszerzenia

## Zarządzanie Zależnościami

### Workspace Dependencies

Pakiety używają workspace dependencies do referencji między sobą:

```json
{
  "dependencies": {
    "@lwk/types": "workspace:*",
    "@lwk/ui": "workspace:*",
    "@lwk/api-client": "workspace:*"
  }
}
```

### Dodawanie Zależności

```bash
# Do konkretnego pakietu
cd packages/ui && pnpm add react-icons

# Workspace dependency
pnpm add @lwk/ui --filter @lwk/dashboard

# Do wszystkich pakietów
pnpm add -w lodash
```

## Development Workflow

### 1. Zmiany w @lwk/types

Po zmianach w Payload CMS:
```bash
# W apps/admin
pnpm generate:types

# W root
pnpm types:sync
```

### 2. Zmiany w @lwk/ui

```bash
# Development z hot reload
cd packages/ui && pnpm dev

# Build dla produkcji
cd packages/ui && pnpm build
```

### 3. Zmiany w @lwk/api-client

```bash
# Test w aplikacji dashboard
cd apps/dashboard && pnpm dev

# Build i test
cd packages/api-client && pnpm build
```

## Turbo Cache

Pakiety korzystają z Turbo cache dla szybszych buildów:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    }
  }
}
```

## TypeScript Configuration

### Shared tsconfig

Pakiety dziedziczą z głównego `tsconfig.json`:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

### Path Mapping

W aplikacjach można używać path mapping:

```json
{
  "compilerOptions": {
    "paths": {
      "@lwk/*": ["../../packages/*/src"]
    }
  }
}
```

## Publikowanie (Przyszłość)

Pakiety są przygotowane do publikowania w npm registry:

```bash
# Build wszystkich pakietów
pnpm build

# Publish (gdy będzie gotowe)
pnpm changeset
pnpm changeset version
pnpm changeset publish
```

## Najlepsze Praktyki

1. **Zawsze używaj workspace dependencies** dla pakietów wewnętrznych
2. **Generuj typy po zmianach w Payload CMS** 
3. **Testuj zmiany we wszystkich aplikacjach** przed commitem
4. **Używaj semantic versioning** dla breaking changes
5. **Dokumentuj API** w pakietach współdzielonych

## Rozwiązywanie Problemów

### Type Issues
```bash
# Regeneruj typy
pnpm generate:types
pnpm types:sync
```

### Dependency Issues
```bash
# Reinstall dependencies
rm -rf node_modules && pnpm install

# Clear Turbo cache
pnpm clean
```

### Build Issues
```bash
# Build w kolejności zależności
pnpm build --filter @lwk/types
pnpm build --filter @lwk/ui
pnpm build --filter @lwk/api-client
```

