import { useContext } from 'react'
import { AppContext } from '../pages/_app'

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'localhost:3000'
export const siteTitle = 'RyLaB'

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
    const { value } = e.target

    if (value) {
      const bufferPass = Buffer.from(value, 'utf8')
      const base64Pass = bufferPass.toString('base64')

      setPassword(value)
      localStorage.setItem('managePass', base64Pass)
    } else {
      setPassword(null)
      localStorage.removeItem('managePass')
    }
  }

  const onEnterKeyPress = e => {
    if (e.key === 'Enter') {
      setManagePass(e)
    }
  }

  return (
    <>
      {children}
      <div id="footer">
        <p className="small light">
          <a href={`mailto:0@${baseUrl}`}>{ `1@${baseUrl}` }</a>
          &nbsp;&middot;&nbsp;
          <a
            alt="Content license URL alias for: CC BY-NC-SA 4.0"
            className="question"
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            rel="noreferrer"
            target="_blank"
            title="Creative Commons BY-NC-SA 4.0">
            some rights reserved</a>
        </p>
        { password
          ? <span className="lockish">&#x1F512;</span>
          :
          <form id="adminCheck">
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
