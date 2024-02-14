import dynamic from 'next/dynamic'
import { ReactNode, useContext } from 'react'
import { BASE_DOMAIN } from '../utils/constants'
import { AppContext } from '../pages/_app'

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
  password?: string
  setPassword?: any
  title?: string
}

export default function Layout({ children, hideAdminInput }: Props) {
  const { password, setPassword } = useContext(AppContext)

  const setManagePass = e => {
    if (typeof e.preventDefault === 'function') e.preventDefault()

    const value = e.target?.value ? e.target.value.trim() : false

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

  const onEnterKeyPress = e => {
    if (e.key === 'Enter') {
      setManagePass(e)
    }
  }

  const onLockPress = l => {
    setManagePass({ target: {} })
  }

  return (
    <>
      {children}
      <div className='flex flex-center mt-20'>
        <HankoAuth />
      </div>
      <div className="footer">
        <p className="light question small">
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
            <form className="adminCheck" onSubmit={setManagePass}>
              <input type="password"
                className="dark"
                name="managePassword"
                style={{ marginTop: 20 }}
                onKeyPress={onEnterKeyPress} />
            </form>
          }</>)}
      </div>
    </>
  )
}
