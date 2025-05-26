# @lwk/types

Wspólny pakiet typów dla projektu LWK, synchronizujący typy między Payload CMS (admin) a Dashboard.

## 🚀 Jak to działa

1. **Payload CMS** generuje typy na podstawie kolekcji
2. **Skrypt synchronizacji** automatycznie tworzy rozszerzone typy dla Dashboard
3. **Oba systemy** używają tych samych typów bazowych

## 📦 Struktura

- `src/payload-types.ts` - Automatycznie generowane typy z Payload CMS
- `src/dashboard-types.ts` - Automatycznie generowane typy dla Dashboard
- `src/shared-types.ts` - Ręcznie definiowane typy wspólne
- `src/validation.ts` - Schemy walidacji Zod

## 🔧 Komendy

```bash
# Generuj typy z Payload CMS
pnpm generate:types

# Synchronizuj typy dla Dashboard
pnpm sync:types

# Zrób oba kroki na raz
pnpm build:types
```

## 🔄 Workflow

1. **Dodawanie nowej kolekcji w Payload:**
   - Dodaj kolekcję w `apps/admin/src/collections`
   - Uruchom `pnpm generate:types` w głównym katalogu
   - Typy zostaną automatycznie wygenerowane

2. **Aktualizacja typów Dashboard:**
   - Jeśli kolekcja wymaga workflow, dodaj ją do `COLLECTIONS_WITH_WORKFLOW` w `scripts/sync-types.js`
   - Uruchom `pnpm sync:types` w pakiecie types

3. **Ręczne typy:**
   - Dodaj je do `src/shared-types.ts` lub `src/validation.ts`

## 📝 Przykład użycia

```typescript
// W Dashboard
import { DashboardExperience, ExperienceFormData, experienceSchema } from '@lwk/types';

// W API Client
import { Experience, ApiResponse } from '@lwk/types';
```

## ⚙️ Automatyczna synchronizacja

Możesz ustawić zmienną środowiskową `REGENERATE_TYPES_ON_CHANGE=true` w aplikacji admin, 
aby typy były regenerowane automatycznie przy zmianach (nie zalecane dla produkcji).
