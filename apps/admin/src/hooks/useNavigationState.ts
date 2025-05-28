import { useCallback } from 'react'

const NAVIGATION_STATE_KEY = 'payload-navigation-state'

interface NavigationState {
    [groupName: string]: boolean
}

export const useNavigationState = () => {
    // Funkcja do zapisywania stanu nawigacji
    const saveNavigationState = useCallback(() => {
        try {
            // Szukamy grup nawigacji używając różnych selektorów Payload CMS
            const selectors = [
                '.nav-group',
                '[class*="nav-group"]',
                '.nav__group',
                '[class*="nav__group"]',
                '.payload-nav-group',
                '[data-nav-group]',
                '.sidebar-nav-group'
            ]

            const navigationGroups = document.querySelectorAll(selectors.join(', '))
            const state: NavigationState = {}

            navigationGroups.forEach((group) => {
                const groupElement = group as HTMLElement

                // Próbujemy znaleźć etykietę grupy na różne sposoby
                let groupLabel = getGroupLabel(groupElement)

                // Sprawdzamy czy grupa jest rozwinięta
                const isExpanded = isGroupExpanded(groupElement)

                if (groupLabel) {
                    state[groupLabel] = isExpanded
                }
            })

            localStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(state))
        } catch (error) {
            console.error('Error saving navigation state:', error)
        }
    }, [])

    // Funkcja do przywracania stanu nawigacji
    const restoreNavigationState = useCallback(() => {
        try {
            const savedState = localStorage.getItem(NAVIGATION_STATE_KEY)

            if (!savedState) {
                // Jeśli nie ma zapisanego stanu, ustaw wszystkie grupy jako rozwinięte domyślnie
                setDefaultExpandedState()
                return
            }

            const state: NavigationState = JSON.parse(savedState)
            const selectors = [
                '.nav-group',
                '[class*="nav-group"]',
                '.nav__group',
                '[class*="nav__group"]',
                '.payload-nav-group',
                '[data-nav-group]',
                '.sidebar-nav-group'
            ]

            const navigationGroups = document.querySelectorAll(selectors.join(', '))

            navigationGroups.forEach((group) => {
                const groupElement = group as HTMLElement
                const groupLabel = getGroupLabel(groupElement)
                const toggleButton = getToggleButton(groupElement)

                if (groupLabel && toggleButton) {
                    const shouldBeExpanded = state[groupLabel] !== undefined ? state[groupLabel] : true
                    const isCurrentlyExpanded = isGroupExpanded(groupElement)

                    // Jeśli stan się różni, kliknij przycisk toggle
                    if (shouldBeExpanded !== isCurrentlyExpanded) {
                        toggleButton.click()
                    }
                }
            })
        } catch (error) {
            console.error('Error restoring navigation state:', error)
            setDefaultExpandedState()
        }
    }, [])

    // Funkcja do ustawienia domyślnego stanu (wszystkie grupy rozwinięte)
    const setDefaultExpandedState = useCallback(() => {
        const selectors = [
            '.nav-group',
            '[class*="nav-group"]',
            '.nav__group',
            '[class*="nav__group"]',
            '.payload-nav-group',
            '[data-nav-group]',
            '.sidebar-nav-group'
        ]

        const navigationGroups = document.querySelectorAll(selectors.join(', '))

        navigationGroups.forEach((group) => {
            const groupElement = group as HTMLElement
            const toggleButton = getToggleButton(groupElement)
            const isCurrentlyExpanded = isGroupExpanded(groupElement)

            // Rozwiń grupę jeśli jest zwinięta
            if (!isCurrentlyExpanded && toggleButton) {
                toggleButton.click()
            }
        })
    }, [])

    // Funkcja pomocnicza do znalezienia etykiety grupy
    const getGroupLabel = (groupElement: HTMLElement): string | null => {
        // Próbujemy znaleźć etykietę grupy na różne sposoby
        let groupLabel = groupElement.querySelector('.nav-group__label, .nav__group-label, .nav-group-label')?.textContent

        if (!groupLabel) {
            // Alternatywne sposoby znalezienia etykiety
            groupLabel = groupElement.querySelector('button, .button, [role="button"]')?.textContent
        }

        if (!groupLabel) {
            // Jeszcze jedna próba - szukamy pierwszego tekstu w grupie
            const textElements = groupElement.querySelectorAll('span, div, p, h1, h2, h3, h4, h5, h6')
            for (const el of textElements) {
                if (el.textContent && el.textContent.trim().length > 0 && el.textContent.trim().length < 50) {
                    groupLabel = el.textContent.trim()
                    break
                }
            }
        }

        return groupLabel?.trim() || null
    }

    // Funkcja pomocnicza do sprawdzenia czy grupa jest rozwinięta
    const isGroupExpanded = (groupElement: HTMLElement): boolean => {
        // Sprawdzamy różne sposoby określenia stanu rozwinięcia
        const isCollapsed = groupElement.classList.contains('collapsed') ||
            groupElement.classList.contains('nav-group--collapsed') ||
            groupElement.classList.contains('nav__group--collapsed') ||
            groupElement.classList.contains('is-collapsed')

        const ariaExpanded = groupElement.getAttribute('aria-expanded')
        if (ariaExpanded !== null) {
            return ariaExpanded === 'true'
        }

        // Sprawdź czy dzieci są widoczne
        const childrenContainer = groupElement.querySelector('.nav-group__children, .nav__group-children, ul, .children')
        if (childrenContainer) {
            const style = window.getComputedStyle(childrenContainer)
            return style.display !== 'none' && style.visibility !== 'hidden'
        }

        return !isCollapsed
    }

    // Funkcja pomocnicza do znalezienia przycisku toggle
    const getToggleButton = (groupElement: HTMLElement): HTMLButtonElement | null => {
        let toggleButton = groupElement.querySelector('button, .button, [role="button"]') as HTMLButtonElement

        if (!toggleButton) {
            // Szukaj w rodzicu lub dzieciach
            toggleButton = groupElement.closest('button') as HTMLButtonElement ||
                groupElement.parentElement?.querySelector('button') as HTMLButtonElement
        }

        return toggleButton
    }

    return {
        saveNavigationState,
        restoreNavigationState,
        setDefaultExpandedState
    }
} 