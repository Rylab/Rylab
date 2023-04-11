import { render, screen } from '@testing-library/react'
import { AppContext } from '../pages/_app'
import Index from '../pages/index'

describe('Index', () => {
  it('renders a heading', () => {
    render(
      <AppContext.Provider value={{
        password: '',
        uuid: '',
        setPassword: jest.fn(),
        setUuid: jest.fn(),
      }}>
        <Index />
      </AppContext.Provider>
    )

    const helloLine = screen.getByText('(: hello :)')

    expect(helloLine).toBeInTheDocument()
  })
})
