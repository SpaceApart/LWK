import { act, renderHook } from '@testing-library/react'
import { useNavigationState } from '../useNavigationState'

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
})

// Mock DOM methods
Object.defineProperty(window, 'getComputedStyle', {
    value: jest.fn(() => ({
        display: 'block',
        visibility: 'visible',
    })),
})

describe('useNavigationState', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        document.body.innerHTML = ''
    })

    describe('saveNavigationState', () => {
        it('should save navigation state to localStorage', () => {
            // Setup DOM
            document.body.innerHTML = `
        <div class="nav-group">
          <span>Content</span>
        </div>
        <div class="nav-group nav-group--collapsed">
          <span>Tourism</span>
        </div>
      `

            const { result } = renderHook(() => useNavigationState())

            act(() => {
                result.current.saveNavigationState()
            })

            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'payload-navigation-state',
                JSON.stringify({
                    Content: true,
                    Tourism: false,
                })
            )
        })

        it('should handle empty navigation groups', () => {
            const { result } = renderHook(() => useNavigationState())

            act(() => {
                result.current.saveNavigationState()
            })

            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'payload-navigation-state',
                JSON.stringify({})
            )
        })

        it('should handle errors gracefully', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
            localStorageMock.setItem.mockImplementation(() => {
                throw new Error('Storage error')
            })

            document.body.innerHTML = `
        <div class="nav-group">
          <span>Content</span>
        </div>
      `

            const { result } = renderHook(() => useNavigationState())

            act(() => {
                result.current.saveNavigationState()
            })

            expect(consoleSpy).toHaveBeenCalledWith('Error saving navigation state:', expect.any(Error))
            consoleSpy.mockRestore()
        })
    })

    describe('restoreNavigationState', () => {
        it('should restore navigation state from localStorage', () => {
            const mockState = {
                Content: true,
                Tourism: false,
            }
            localStorageMock.getItem.mockReturnValue(JSON.stringify(mockState))

            // Setup DOM with buttons
            document.body.innerHTML = `
        <div class="nav-group nav-group--collapsed">
          <button>Content</button>
        </div>
        <div class="nav-group">
          <button>Tourism</button>
        </div>
      `

            const buttons = document.querySelectorAll('button')
            const clickSpy = jest.spyOn(buttons[0], 'click')
            const clickSpy2 = jest.spyOn(buttons[1], 'click')

            const { result } = renderHook(() => useNavigationState())

            act(() => {
                result.current.restoreNavigationState()
            })

            expect(localStorageMock.getItem).toHaveBeenCalledWith('payload-navigation-state')
            expect(clickSpy).toHaveBeenCalled() // Content should be expanded
            expect(clickSpy2).toHaveBeenCalled() // Tourism should be collapsed
        })

        it('should set default expanded state when no saved state exists', () => {
            localStorageMock.getItem.mockReturnValue(null)

            document.body.innerHTML = `
        <div class="nav-group nav-group--collapsed">
          <button>Content</button>
        </div>
      `

            const button = document.querySelector('button')
            const clickSpy = jest.spyOn(button!, 'click')

            const { result } = renderHook(() => useNavigationState())

            act(() => {
                result.current.restoreNavigationState()
            })

            expect(clickSpy).toHaveBeenCalled() // Should expand collapsed group
        })

        it('should handle invalid JSON gracefully', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
            localStorageMock.getItem.mockReturnValue('invalid json')

            const { result } = renderHook(() => useNavigationState())

            act(() => {
                result.current.restoreNavigationState()
            })

            expect(consoleSpy).toHaveBeenCalledWith('Error restoring navigation state:', expect.any(Error))
            consoleSpy.mockRestore()
        })
    })

    describe('setDefaultExpandedState', () => {
        it('should expand all collapsed navigation groups', () => {
            document.body.innerHTML = `
        <div class="nav-group nav-group--collapsed">
          <button>Content</button>
        </div>
        <div class="nav-group nav-group--collapsed">
          <button>Tourism</button>
        </div>
        <div class="nav-group">
          <button>System</button>
        </div>
      `

            const buttons = document.querySelectorAll('button')
            const clickSpies = Array.from(buttons).map(button => jest.spyOn(button, 'click'))

            const { result } = renderHook(() => useNavigationState())

            act(() => {
                result.current.setDefaultExpandedState()
            })

            // First two buttons should be clicked (collapsed groups)
            expect(clickSpies[0]).toHaveBeenCalled()
            expect(clickSpies[1]).toHaveBeenCalled()
            // Third button should not be clicked (already expanded)
            expect(clickSpies[2]).not.toHaveBeenCalled()
        })

        it('should handle groups without toggle buttons', () => {
            document.body.innerHTML = `
        <div class="nav-group nav-group--collapsed">
          <span>Content</span>
        </div>
      `

            const { result } = renderHook(() => useNavigationState())

            // Should not throw error
            expect(() => {
                act(() => {
                    result.current.setDefaultExpandedState()
                })
            }).not.toThrow()
        })
    })

    describe('helper functions', () => {
        it('should detect expanded state using aria-expanded attribute', () => {
            document.body.innerHTML = `
        <div class="nav-group" aria-expanded="true">
          <span>Content</span>
        </div>
        <div class="nav-group" aria-expanded="false">
          <span>Tourism</span>
        </div>
      `

            const { result } = renderHook(() => useNavigationState())

            act(() => {
                result.current.saveNavigationState()
            })

            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'payload-navigation-state',
                JSON.stringify({
                    Content: true,
                    Tourism: false,
                })
            )
        })

        it('should detect expanded state using visibility of children', () => {
            const mockGetComputedStyle = jest.fn()
            mockGetComputedStyle
                .mockReturnValueOnce({ display: 'block', visibility: 'visible' })
                .mockReturnValueOnce({ display: 'none', visibility: 'hidden' })

            Object.defineProperty(window, 'getComputedStyle', {
                value: mockGetComputedStyle,
            })

            document.body.innerHTML = `
        <div class="nav-group">
          <span>Content</span>
          <ul class="children"></ul>
        </div>
        <div class="nav-group">
          <span>Tourism</span>
          <ul class="children"></ul>
        </div>
      `

            const { result } = renderHook(() => useNavigationState())

            act(() => {
                result.current.saveNavigationState()
            })

            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'payload-navigation-state',
                JSON.stringify({
                    Content: true,
                    Tourism: false,
                })
            )
        })

        it('should find group labels in different ways', () => {
            document.body.innerHTML = `
        <div class="nav-group">
          <div class="nav-group__label">Content</div>
        </div>
        <div class="nav-group">
          <button>Tourism</button>
        </div>
        <div class="nav-group">
          <div><span>System</span></div>
        </div>
      `

            const { result } = renderHook(() => useNavigationState())

            act(() => {
                result.current.saveNavigationState()
            })

            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'payload-navigation-state',
                JSON.stringify({
                    Content: true,
                    Tourism: true,
                    System: true,
                })
            )
        })
    })
}) 