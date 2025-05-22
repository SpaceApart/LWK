---
description: 
globs: 
alwaysApply: true
---
# Konfiguracja Payload CMS

Payload CMS jest zintegrowany z aplikacją web. Poniżej znajdują się najważniejsze pliki konfiguracyjne i kolekcje.

## Główna konfiguracja

- [apps/web/src/payload.config.ts](mdc:apps/web/src/payload.config.ts) - Główny plik konfiguracyjny Payload

## Kolekcje

- [apps/web/src/collections](mdc:apps/web/src/collections) - Definicje kolekcji
  - [apps/web/src/collections/Pages](mdc:apps/web/src/collections/Pages) - Strony
  - [apps/web/src/collections/Posts](mdc:apps/web/src/collections/Posts) - Posty bloga
  - [apps/web/src/collections/Users](mdc:apps/web/src/collections/Users) - Użytkownicy
  - [apps/web/src/collections/Media](mdc:apps/web/src/collections/Media) - Media
  - [apps/web/src/collections/Tags](mdc:apps/web/src/collections/Tags) - Tagi

## Bloki treści

- [apps/web/src/blocks](mdc:apps/web/src/blocks) - Komponenty blokowe do edytora treści
  - [apps/web/src/blocks/Content](mdc:apps/web/src/blocks/Content) - Blok treści tekstowej
  - [apps/web/src/blocks/MediaBlock](mdc:apps/web/src/blocks/MediaBlock) - Blok mediów
  - [apps/web/src/blocks/Form](mdc:apps/web/src/blocks/Form) - Blok formularza

## Globalne komponenty

- [apps/web/src/globals](mdc:apps/web/src/globals) - Globalne konfiguracje
  - [apps/web/src/globals/Header](mdc:apps/web/src/globals/Header) - Nagłówek
  - [apps/web/src/globals/Footer](mdc:apps/web/src/globals/Footer) - Stopka

## Hooki

- [apps/web/src/collections/Pages/hooks](mdc:apps/web/src/collections/Pages/hooks) - Hooki dla kolekcji stron
- [apps/web/src/collections/Posts/hooks](mdc:apps/web/src/collections/Posts/hooks) - Hooki dla kolekcji postów
