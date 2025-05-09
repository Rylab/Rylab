import dynamic from 'next/dynamic'
import { ChangeEvent, KeyboardEvent, MouseEvent, ReactNode, useContext } from 'react'

import { AppContext } from '../pages/_app'
import { BASE_DOMAIN } from '../utils/constants'

const HankoAuth = dynamic(() => import('./HankoAuth'), { ssr: false })

// NOTE: should consolidate style defaults elsewhere if adding more
export const tapeColors = [
  '#777',
  'rgb(238, 231, 200)',
  'rgb(111, 231, 200)',
  'rgb(198, 131, 200)',
  'rgb(198, 231, 100)',
  '#999',
  'rgba(255, 0, 0, 0.3)',
  'rgba(0, 255, 0, 0.3)',
  'rgba(0, 0, 255, 0.3)',
]

type Props = {
  children?: ReactNode
  hideAdminInput?: boolean
  useAuth?: boolean
  password?: string
  setPassword?: any
  showLogin?: boolean
  title?: string
}

export default function Layout({ children, hideAdminInput, useAuth }: Props) {
  const { password, setPassword } = useContext(AppContext)
  const { showLogin, setShowLogin } = useContext(AppContext)

  const setManagePass = (e: ChangeEvent<HTMLInputElement>|KeyboardEvent<HTMLInputElement>) => {
    if (e.preventDefault && typeof e.preventDefault === 'function') e.preventDefault()

    const el = e.target as HTMLInputElement
    const value = el.value ? el.value.trim() : false

    if (value) {
      const bufferPass = Buffer.from(value, 'utf8')
      const base64Pass = bufferPass.toString('base64')

      localStorage.setItem('managePass', base64Pass)
      setPassword(value)
    } else {
      setPassword('')
      localStorage.removeItem('managePass')
    }
  }

  const onEnterKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setManagePass(e)
    }
  }

  const onLockPress = (l: MouseEvent<HTMLSpanElement>) => {
    const emptyTarget = { target: { value: '' } }

    setManagePass(emptyTarget as ChangeEvent<HTMLInputElement>)
  }

  return (
    <>
      {children}
      {useAuth && (
        <div className="finger light narrow mt-30" style={{ minHeight: 300 }}>
          <HankoAuth />
          <p style={{ marginTop: 0 }}>Listen to, create, or join jam bands</p>
        </div>
      )}
      <div className="footer">
        <p className="question small">
          <a href={`mailto:0@${BASE_DOMAIN}`} title="Mail Me?">{`1@${BASE_DOMAIN}`}</a>
          &nbsp;&middot;&nbsp;
          <a
            className="question"
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            rel="noreferrer"
            target="_blank"
            title="Content license URL alias for: CC BY-NC-SA 4.0">
            some rights reserved</a>
        </p>
        {hideAdminInput ? <></> : (<>
          {password
            ? <span className="adminCheck lockish" onClick={onLockPress}>&#x1F512;</span>
            :
            <form className="adminCheck">
              <input type="password"
                name="managePassword"
                style={{ marginTop: 20 }}
                onKeyPress={onEnterKeyPress} />
            </form>
          }</>)}
      </div>
    </>
  )
}
