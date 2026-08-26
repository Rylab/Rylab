import { render, screen } from '@testing-library/react'
import { AppContext } from '../pages/_app'
import Navigation from './Navigation'

describe('Navigation', () => {
  it('renders expected navigation with no path', () => {
    render(
      <AppContext.Provider value={{
        password: '',
        setPassword: jest.fn(),
        setShowLogin: jest.fn(),
        uuid: '',
        setUuid: jest.fn(),
        showLogin: false,
      }}>
        <Navigation />
      </AppContext.Provider>
    )

    const navigationPath = screen.getByTestId('navigation-path').innerHTML

    expect(navigationPath).toMatch(/\/$/)
  })

  it('renders expected navigation with path', () => {
    render(
      <AppContext.Provider value={{
        password: '',
        setPassword: jest.fn(),
        setShowLogin: jest.fn(),
        uuid: '',
        setUuid: jest.fn(),
        showLogin: false,
      }}>
        <Navigation path="test" />
      </AppContext.Provider>
    )

    const navigationPath = screen.getByTestId('navigation-path').innerHTML

    expect(navigationPath).toContain('/test')
  })
})
