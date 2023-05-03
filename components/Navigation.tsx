import Link from 'next/link'
import { baseUrl } from './Layout'
import { selectText } from '../utils/helpers'

export default function Navigation({ path = '' }) {
  return (
    <div className="navigation">
      <Link href="/">
        <img alt="RyLaB home" src="/img/bsd_introvert.png" className="icon" />
      </Link>
      <div className="navUrl selectable">
        <Link data-testid="navigation-protocol" className="protocol" href="/">{ baseUrl }</Link>
        <span data-testid="navigation-path" className="path" onClick={() => selectText('navUrl')}>/{ path }</span>
      </div>
    </div>
  )
}
