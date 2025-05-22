---
description:
globs:
alwaysApply: false
---
# Komponenty UI

Projekt wykorzystuje wspólny pakiet UI, który może być używany przez różne aplikacje w monorepo.

## Shared UI Package

- [packages/ui](mdc:packages/ui) - Pakiet zawierający współdzielone komponenty UI

## Dashboard Components

Komponenty specyficzne dla aplikacji dashboard:

- [apps/dashboard/src/components/ui](mdc:apps/dashboard/src/components/ui) - Podstawowe komponenty UI
- [apps/dashboard/src/components/layout](mdc:apps/dashboard/src/components/layout) - Komponenty układu strony
  - [apps/dashboard/src/components/layout/ThemeToggle](mdc:apps/dashboard/src/components/layout/ThemeToggle) - Przełącznik motywu
- [apps/dashboard/src/components/kbar](mdc:apps/dashboard/src/components/kbar) - Komponenty paska komend (cmd+k)
- [apps/dashboard/src/components/modal](mdc:apps/dashboard/src/components/modal) - Komponenty modali

## Web Components

Komponenty specyficzne dla aplikacji web:

- [apps/web/src/components/ui](mdc:apps/web/src/components/ui) - Podstawowe komponenty UI
- [apps/web/src/components/Card](mdc:apps/web/src/components/Card) - Karty
- [apps/web/src/components/RichText](mdc:apps/web/src/components/RichText) - Edytor tekstu sformatowanego
- [apps/web/src/components/Media](mdc:apps/web/src/components/Media) - Komponenty mediów
  - [apps/web/src/components/Media/ImageMedia](mdc:apps/web/src/components/Media/ImageMedia) - Obrazy
  - [apps/web/src/components/Media/VideoMedia](mdc:apps/web/src/components/Media/VideoMedia) - Wideo
- [apps/web/src/components/CollectionArchive](mdc:apps/web/src/components/CollectionArchive) - Archiwum kolekcji
- [apps/web/src/components/Pagination](mdc:apps/web/src/components/Pagination) - Paginacja
