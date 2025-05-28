import { render, fireEvent, waitFor } from '@testing-library/react'
import NavigationStateManager from '../index'

// Mock useNavigationState hook
const mockSaveNavigationState = jest.fn()
const mockRestoreNavigationState = jest.fn()
const mockSetDefaultExpandedState = jest.fn()

jest.mock('@/hooks/useNavigationState', () => ({
  useNavigationState: () => ({
    saveNavigationState: mockSaveNavigationState,
    restoreNavigationState: mockRestoreNavigationState,
    setDefaultExpandedState: mockSetDefaultExpandedState,
  }),
}))

// Mock MutationObserver
const mockObserve = jest.fn()
const mockDisconnect = jest.fn()

global.MutationObserver = jest.fn().mockImplementation((callback) => ({
  observe: mockObserve,
  disconnect: mockDisconnect,
  callback,
}))

describe('NavigationStateManager', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    document.body.innerHTML = ''
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should render without visual output', () => {
    const { container } = render(<NavigationStateManager />)
    expect(container.firstChild).toBeNull()
  })

  it('should set up MutationObserver on mount', () => {
    render(<NavigationStateManager />)
    
    expect(global.MutationObserver).toHaveBeenCalled()
    expect(mockObserve).toHaveBeenCalledWith(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'aria-expanded'],
    })
  })

  it('should add click event listener on mount', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener')
    
    render(<NavigationStateManager />)
    
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
      true
    )
  })

  it('should cleanup on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener')
    
    const { unmount } = render(<NavigationStateManager />)
    unmount()
    
    expect(mockDisconnect).toHaveBeenCalled()
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
      true
    )
  })

  it('should handle navigation clicks and save state', async () => {
    render(<NavigationStateManager />)
    
    // Setup DOM with navigation element
    document.body.innerHTML = `
      <div class="nav-group">
        <button>Content</button>
      </div>
    `
    
    const button = document.querySelector('button')!
    fireEvent.click(button)
    
    // Fast-forward timers to trigger the delayed save
    jest.advanceTimersByTime(150)
    
    await waitFor(() => {
      expect(mockSaveNavigationState).toHaveBeenCalled()
    })
  })

  it('should not save state for non-navigation clicks', async () => {
    render(<NavigationStateManager />)
    
    // Setup DOM with non-navigation element
    document.body.innerHTML = `
      <div class="some-other-element">
        <span>Not navigation</span>
      </div>
    `
    
    const span = document.querySelector('span')!
    fireEvent.click(span)
    
    jest.advanceTimersByTime(150)
    
    expect(mockSaveNavigationState).not.toHaveBeenCalled()
  })

  it('should restore state when navigation elements are added to DOM', async () => {
    const { container } = render(<NavigationStateManager />)
    
    // Get the MutationObserver callback
    const mutationObserverCallback = (global.MutationObserver as jest.Mock).mock.calls[0][0]
    
    // Simulate adding navigation elements
    const navElement = document.createElement('div')
    navElement.className = 'nav-group'
    document.body.appendChild(navElement)
    
    // Simulate MutationObserver detecting the change
    const mutations = [{
      type: 'childList',
      addedNodes: [navElement],
    }]
    
    mutationObserverCallback(mutations)
    
    // Fast-forward timers to trigger the delayed restore
    jest.advanceTimersByTime(300)
    
    await waitFor(() => {
      expect(mockRestoreNavigationState).toHaveBeenCalled()
    })
  })

  it('should save state when navigation attributes change', async () => {
    render(<NavigationStateManager />)
    
    // Setup DOM with navigation element
    const navElement = document.createElement('div')
    navElement.className = 'nav-group'
    document.body.appendChild(navElement)
    
    // Get the MutationObserver callback
    const mutationObserverCallback = (global.MutationObserver as jest.Mock).mock.calls[0][0]
    
    // Simulate attribute change
    const mutations = [{
      type: 'attributes',
      attributeName: 'aria-expanded',
      target: navElement,
    }]
    
    mutationObserverCallback(mutations)
    
    // Fast-forward timers to trigger the delayed save
    jest.advanceTimersByTime(50)
    
    await waitFor(() => {
      expect(mockSaveNavigationState).toHaveBeenCalled()
    })
  })

  it('should perform initial check for existing navigation', async () => {
    // Setup DOM with existing navigation before component mounts
    document.body.innerHTML = `
      <div class="nav-group">
        <button>Content</button>
      </div>
    `
    
    render(<NavigationStateManager />)
    
    // Fast-forward timers to trigger the initial check
    jest.advanceTimersByTime(500)
    
    await waitFor(() => {
      expect(mockRestoreNavigationState).toHaveBeenCalled()
    })
  })

  it('should retry initial check if navigation not found', async () => {
    render(<NavigationStateManager />)
    
    // Fast-forward first check (no navigation found)
    jest.advanceTimersByTime(500)
    
    // Fast-forward retry
    jest.advanceTimersByTime(1000)
    
    // Should have attempted to check twice
    expect(setTimeout).toHaveBeenCalledTimes(2)
  })

  it('should handle multiple navigation selectors', async () => {
    render(<NavigationStateManager />)
    
    // Test different navigation selectors
    const selectors = [
      'nav-group',
      'nav__group', 
      'payload-nav-group',
      'sidebar-nav-group'
    ]
    
    for (const selector of selectors) {
      document.body.innerHTML = `<div class="${selector}"><button>Test</button></div>`
      
      const button = document.querySelector('button')!
      fireEvent.click(button)
      
      jest.advanceTimersByTime(150)
      
      await waitFor(() => {
        expect(mockSaveNavigationState).toHaveBeenCalled()
      })
      
      mockSaveNavigationState.mockClear()
    }
  })

  it('should handle clicks on elements with role="button"', async () => {
    render(<NavigationStateManager />)
    
    document.body.innerHTML = `
      <div class="nav-group">
        <div role="button">Content</div>
      </div>
    `
    
    const roleButton = document.querySelector('[role="button"]')!
    fireEvent.click(roleButton)
    
    jest.advanceTimersByTime(150)
    
    await waitFor(() => {
      expect(mockSaveNavigationState).toHaveBeenCalled()
    })
  })

  it('should handle clicks on elements with button class', async () => {
    render(<NavigationStateManager />)
    
    document.body.innerHTML = `
      <div class="nav-group">
        <div class="button">Content</div>
      </div>
    `
    
    const buttonClass = document.querySelector('.button')!
    fireEvent.click(buttonClass)
    
    jest.advanceTimersByTime(150)
    
    await waitFor(() => {
      expect(mockSaveNavigationState).toHaveBeenCalled()
    })
  })
}) 