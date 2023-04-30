import { render, screen } from '@testing-library/react'
import { AppContext } from '../pages/_app'
import Index from '../pages/index'
import NotFound from '../pages/404'
import InternalServerError from '../pages/500'

describe('Index', () => {
  it('renders main heading', () => {
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

describe('NotFound', () => {
  it('renders 404 heading', () => {
    render(
      <NotFound />
    )

    const helloLine = screen.getByText('Not Found')

    expect(helloLine).toBeInTheDocument()
  })
})

describe('InternalServerError', () => {
  it('renders 500 heading', () => {
    render(
      <InternalServerError />
    )

    const helloLine = screen.getByText('Internal Server Error')

    expect(helloLine).toBeInTheDocument()
  })
})
