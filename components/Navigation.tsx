import Image from 'next/image'
import Link from 'next/link'
import { BASE_URL } from '../utils/constants'
import { selectText } from '../utils/helpers'

export default function Navigation({ path = '' }) {
  return (
    <div className="navigation">
      <Link href="/" className="discreet">
        <Image alt="RyLaB home" src="/img/bsd_introvert.webp" height={32} width={32} className="icon" />
      </Link>
      <div className="navUrl selectable">
        <Link data-testid="navigation-protocol" className="protocol" href="/">{BASE_URL}</Link>
        <span data-testid="navigation-path" className="path" onClick={() => selectText('navUrl')}>/{path}</span>
      </div>
    </div>
  )
}
