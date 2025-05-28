import { ConsoleLogger } from '@/components/console-logger';
import Providers from '@/components/layout/providers';
import ThemeProvider from '@/components/layout/ThemeToggle/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { fontVariables } from '@/lib/font';
import { cn } from '@/lib/utils';
import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';
import './theme.css';

const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b'
};

export const metadata: Metadata = {
  title: 'Next Shadcn',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get('active_theme')?.value;
  const isScaled = activeThemeValue?.endsWith('-scaled');

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Console Logger for Dashboard
              (function() {
                const originalLog = console.log;
                const originalError = console.error;
                const originalWarn = console.warn;
                const originalInfo = console.info;
                
                const logs = [];
                
                function logToStorage(type, args) {
                  const timestamp = new Date().toISOString();
                  const logEntry = {
                    timestamp,
                    type,
                    message: Array.from(args).map(arg => 
                      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                    ).join(' ')
                  };
                  
                  logs.push(logEntry);
                  
                  // Zachowaj tylko ostatnie 100 logów
                  if (logs.length > 100) {
                    logs.shift();
                  }
                  
                  // Zapisz do localStorage
                  try {
                    localStorage.setItem('dashboard_console_logs', JSON.stringify(logs));
                  } catch (e) {
                    // Ignoruj błędy localStorage
                  }
                }
                
                console.log = function(...args) {
                  logToStorage('log', args);
                  originalLog.apply(console, args);
                };
                
                console.error = function(...args) {
                  logToStorage('error', args);
                  originalError.apply(console, args);
                };
                
                console.warn = function(...args) {
                  logToStorage('warn', args);
                  originalWarn.apply(console, args);
                };
                
                console.info = function(...args) {
                  logToStorage('info', args);
                  originalInfo.apply(console, args);
                };
                
                // Dodaj globalną funkcję do pobierania logów
                window.getDashboardLogs = function() {
                  try {
                    return JSON.parse(localStorage.getItem('dashboard_console_logs') || '[]');
                  } catch (e) {
                    return [];
                  }
                };
                
                // Dodaj funkcję do czyszczenia logów
                window.clearDashboardLogs = function() {
                  localStorage.removeItem('dashboard_console_logs');
                  logs.length = 0;
                };
                
                console.log('Dashboard Console Logger initialized');
              })();
            `
          }}
        />
      </head>
      <body
        className={cn(
          'bg-background overflow-hidden overscroll-none font-sans antialiased',
          activeThemeValue ? `theme-${activeThemeValue}` : '',
          isScaled ? 'theme-scaled' : '',
          fontVariables
        )}
      >
        <NextTopLoader showSpinner={false} />
        <NuqsAdapter>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            <Providers activeThemeValue={activeThemeValue as string}>
              <Toaster />
              <ConsoleLogger />
              {children}
            </Providers>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
