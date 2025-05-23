import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

import pl from './messages/pl.json'

type Messages = typeof pl

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
