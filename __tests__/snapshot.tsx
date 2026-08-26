import { render } from '@testing-library/react'
import { AppContext } from '../pages/_app'
import Index from '../pages/index'

it('renders homepage unchanged', () => {
  const { container } = render(
    <AppContext.Provider value={{
      password: '',
      setPassword: jest.fn(),
      setShowLogin: jest.fn(),
      uuid: '',
      setUuid: jest.fn(),
      showLogin: false,
    }}>
      <Index />
    </AppContext.Provider>
  )

  expect(container).toMatchSnapshot()
})
