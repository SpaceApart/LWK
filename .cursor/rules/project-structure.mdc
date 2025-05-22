---
description:
globs:
alwaysApply: false
---
# Struktura Projektu LWK

Ten projekt jest zorganizowany jako monorepo przy użyciu Turborepo. Zawiera dwie główne aplikacje oraz wspólne pakiety.

## Główna struktura

- [package.json](mdc:package.json) - Główny plik konfiguracyjny projektu
- [turbo.json](mdc:turbo.json) - Konfiguracja Turborepo

## Aplikacje

### Dashboard

Dashboard to wewnętrzny panel administracyjny zbudowany na Next.js:

- [apps/dashboard/package.json](mdc:apps/dashboard/package.json) - Konfiguracja aplikacji dashboard
- [apps/dashboard/next.config.js](mdc:apps/dashboard/next.config.js) - Konfiguracja Next.js
- [apps/dashboard/src/app](mdc:apps/dashboard/src/app) - Katalog główny aplikacji (App Router)

### Web

Web to aplikacja kliencka integrująca Payload CMS:

- [apps/web/src/app/(frontend)](mdc:apps/web/src/app/(frontend)) - Frontend aplikacji
- [apps/web/src/app/(payload)](mdc:apps/web/src/app/(payload)) - Payload CMS

## Współdzielone pakiety

- [packages/api-client](mdc:packages/api-client) - Klient API
- [packages/types](mdc:packages/types) - Wspólne typy TypeScript
- [packages/ui](mdc:packages/ui) - Wspólne komponenty UI

## Integracje

- Clerk - System autentykacji
- Payload CMS - Headless CMS
- Next.js - Framework React
- TailwindCSS - Framework CSS
