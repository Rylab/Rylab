import Link from 'next/link'
import { baseUrl } from './layout'
import { selectText } from '../utils/helpers'

export default function Navigation({ path = '' }) {
  return (
    <div id="navigation">
      <Link href="/">
        <img alt="RyLaB home" src="/img/bsd_introvert.png" className="icon" />
      </Link>
      <div id="navUrl" className="selectable">
        <span onClick={() => selectText('navUrl')}>{ baseUrl }/{ path }</span>
      </div>
    </div>
  )
}
