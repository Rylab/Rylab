import { render, screen } from '@testing-library/react'
import Index from '@/pages/index'

describe('Index', () => {
  it('renders a heading', () => {
    render(<Index />)

    const contentDiv = document.getElementById('content')
    const helloLine = screen.getByText('(: hello :)')

    expect(contentDiv).toBeInTheDocument()
    expect(helloLine).toBeInTheDocument()
  })
})
