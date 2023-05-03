import { render, screen } from '@testing-library/react'
import { AppContext } from '../pages/_app'
import LoadingSpinner from './LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders loading spinner', () => {
    render(
      <AppContext.Provider value={{
        password: '',
        uuid: '',
        setPassword: jest.fn(),
        setUuid: jest.fn(),
      }}>
        <LoadingSpinner />
      </AppContext.Provider>
    )

    const loadingSpinner = screen.getByTestId('loading-spinner')

    expect(loadingSpinner).toBeInTheDocument()
  })
})
