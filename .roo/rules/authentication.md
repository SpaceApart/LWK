---
description: 
globs: 
alwaysApply: true
---
# Autentykacja

Projekt wykorzystuje różne metody autentykacji dla poszczególnych aplikacji.

## Dashboard Auth (Clerk)

Dashboard korzysta z Clerk do autentykacji:

- [apps/dashboard/src/features/auth/components](mdc:apps/dashboard/src/features/auth/components) - Komponenty autentykacji
- [apps/dashboard/src/app/auth/sign-in/[[...sign-in]]](mdc:apps/dashboard/src/app/auth/sign-in/[[...sign-in]]) - Strona logowania
- [apps/dashboard/src/app/auth/sign-up/[[...sign-up]]](mdc:apps/dashboard/src/app/auth/sign-up/[[...sign-up]]) - Strona rejestracji

## Web Auth (Payload)

Web korzysta z wbudowanego systemu autentykacji Payload:

- [apps/web/src/collections/Users](mdc:apps/web/src/collections/Users) - Kolekcja użytkowników
- [apps/web/src/components/BeforeLogin](mdc:apps/web/src/components/BeforeLogin) - Komponenty dla niezalogowanych
- [apps/web/src/components/AfterDashboard](mdc:apps/web/src/components/AfterDashboard) - Komponenty dla zalogowanych

## Autentykacja API

- [packages/api-client/src/auth](mdc:packages/api-client/src/auth) - Autentykacja w kliencie API
