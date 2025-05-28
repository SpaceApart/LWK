import type { Metadata } from 'next'
import React from 'react'
import { ConsoleLogger } from '../components/console-logger'

export const metadata: Metadata = {
  title: 'LWK Admin Panel',
  description: 'Panel administracyjny LWK oparty na Payload CMS'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Console Logger for Admin Panel
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
                    localStorage.setItem('admin_console_logs', JSON.stringify(logs));
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
                window.getAdminLogs = function() {
                  try {
                    return JSON.parse(localStorage.getItem('admin_console_logs') || '[]');
                  } catch (e) {
                    return [];
                  }
                };
                
                // Dodaj funkcję do czyszczenia logów
                window.clearAdminLogs = function() {
                  localStorage.removeItem('admin_console_logs');
                  logs.length = 0;
                };
                
                console.log('Admin Panel Console Logger initialized');
              })();
            `
          }}
        />
      </head>
      <body>
        <ConsoleLogger />
        {children}
      </body>
    </html>
  )
} 