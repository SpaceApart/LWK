'use client'

import React, { useEffect } from 'react'
import { useNavigationState } from '@/hooks/useNavigationState'

const NavigationStateManager: React.FC = () => {
  const { saveNavigationState, restoreNavigationState, setDefaultExpandedState } = useNavigationState()

  useEffect(() => {
    // Funkcja do obsługi kliknięć w grupy nawigacji
    const handleNavigationClick = (event: Event) => {
      const target = event.target as HTMLElement
      
      // Sprawdź czy kliknięto w element nawigacji
      const navSelectors = [
        '.nav-group',
        '[class*="nav-group"]',
        '.nav__group',
        '[class*="nav__group"]',
        '.payload-nav-group',
        '[data-nav-group]',
        '.sidebar-nav-group'
      ]
      
      const isNavClick = navSelectors.some(selector => 
        target.closest(selector) || target.matches('button, .button, [role="button"]')
      )
      
      if (isNavClick) {
        // Opóźnij zapisanie stanu, aby DOM zdążył się zaktualizować
        setTimeout(saveNavigationState, 150)
      }
    }

    // Funkcja do inicjalizacji obserwatora mutacji
    const initializeMutationObserver = () => {
      const observer = new MutationObserver((mutations) => {
        let shouldRestoreState = false
        
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            const addedNodes = Array.from(mutation.addedNodes)
            const navSelectors = [
              '.nav-group',
              '[class*="nav-group"]',
              '.nav__group',
              '[class*="nav__group"]',
              '.payload-nav-group',
              '[data-nav-group]',
              '.sidebar-nav-group',
              'nav',
              '.nav',
              '[role="navigation"]'
            ]
            
            const hasNavigationNodes = addedNodes.some(node => 
              node instanceof Element && 
              navSelectors.some(selector =>
                node.querySelector(selector) || node.matches(selector)
              )
            )

            if (hasNavigationNodes) {
              shouldRestoreState = true
            }
          }
          
          // Obserwuj zmiany klas (collapsed/expanded)
          if (mutation.type === 'attributes' && 
              (mutation.attributeName === 'class' || mutation.attributeName === 'aria-expanded')) {
            const target = mutation.target as Element
            const navSelectors = [
              '.nav-group',
              '[class*="nav-group"]',
              '.nav__group',
              '[class*="nav__group"]',
              '.payload-nav-group',
              '[data-nav-group]',
              '.sidebar-nav-group'
            ]
            
            const isNavElement = navSelectors.some(selector => target.closest(selector))
            if (isNavElement) {
              setTimeout(saveNavigationState, 50)
            }
          }
        })

        if (shouldRestoreState) {
          // Opóźnij przywracanie stanu, aby DOM zdążył się w pełni załadować
          setTimeout(restoreNavigationState, 300)
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'aria-expanded']
      })

      return observer
    }

    // Inicjalizacja
    const observer = initializeMutationObserver()
    
    // Dodaj listener dla kliknięć
    document.addEventListener('click', handleNavigationClick, true)

    // Spróbuj przywrócić stan od razu (jeśli nawigacja już istnieje)
    const initialCheck = () => {
      const navSelectors = [
        '.nav-group',
        '[class*="nav-group"]',
        '.nav__group',
        '[class*="nav__group"]',
        '.payload-nav-group',
        '[data-nav-group]',
        '.sidebar-nav-group',
        'nav',
        '.nav',
        '[role="navigation"]'
      ]
      
      const navExists = navSelectors.some(selector => document.querySelector(selector))
      
      if (navExists) {
        restoreNavigationState()
      } else {
        // Spróbuj ponownie za chwilę
        setTimeout(initialCheck, 1000)
      }
    }
    
    setTimeout(initialCheck, 500)

    // Cleanup
    return () => {
      observer.disconnect()
      document.removeEventListener('click', handleNavigationClick, true)
    }
  }, [saveNavigationState, restoreNavigationState, setDefaultExpandedState])

  return null // Ten komponent nie renderuje niczego wizualnego
}

export default NavigationStateManager 