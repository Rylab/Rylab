import { useContext } from 'react'
import { AppContext } from '../pages/_app'

export const baseDomain = process.env.NEXT_PUBLIC_BASE_URI
  ? process.env.NEXT_PUBLIC_BASE_URI.toString().trim() : 'localhost'
export const basePort = process.env.NEXT_PUBLIC_BASE_PORT
  ? parseInt(process.env.NEXT_PUBLIC_BASE_PORT, 10) : 443

export const baseUrl = `http${basePort === 443 ? 's':''}://${baseDomain}${[80,443].includes(basePort) ? '': `:${basePort }`}`

export const siteTitle = 'RyLaB'

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

export default function Layout({ children }) {
  const { password, setPassword } = useContext(AppContext)

  const setManagePass = e => {
    if (typeof e.preventDefault === 'function') e.preventDefault()

    const value = e.target?.value ? e.target.value.trim() : false

    if (value) {
      const bufferPass = Buffer.from(value, 'utf8')
      const base64Pass = bufferPass.toString('base64')

      setPassword(value)
      localStorage.setItem('managePass', base64Pass)
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
      <div className="footer">
        <p className="light question small">
          <a href={`mailto:0@${baseDomain}`} title="Mail Me?">{ `1@${baseDomain}` }</a>
          &nbsp;&middot;&nbsp;
          <a
            alt="Content license URL alias for: CC BY-NC-SA 4.0"
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            rel="noreferrer"
            target="_blank"
            title="Creative Commons BY-NC-SA 4.0">
            some rights reserved</a>
        </p>
        { password
          ? <span className="adminCheck lockish" onClick={onLockPress}>&#x1F512;</span>
          :
          <form className="adminCheck" onSubmit={setManagePass}>
            <input type="password"
              className="dark"
              name="managePassword"
              style={{ marginTop: 20 }}
              onKeyPress={onEnterKeyPress} />
          </form>
        }
      </div>
    </>
  )
}
