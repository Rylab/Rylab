import { render } from '@testing-library/react'
import { AppContext } from '../pages/_app'
import Index from '../pages/index'

it('renders homepage unchanged', () => {
  const { container } = render(
    <AppContext.Provider value={{
      password: '',
      uuid: '',
      setPassword: jest.fn(),
      setUuid: jest.fn(),
    }}>
      <Index />
    </AppContext.Provider>
  )

  expect(container).toMatchSnapshot()
})
