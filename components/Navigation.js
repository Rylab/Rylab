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
        <Link className="protocol" href="/">{ baseUrl }</Link>
        <span className="path" onClick={() => selectText('navUrl')}>/{ path }</span>
      </div>
    </div>
  )
}
