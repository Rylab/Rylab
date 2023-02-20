import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { initUuid } from '../utils/helpers'

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'localhost'
export const jsonContentType = 'application/json';
export const siteTitle = 'RyLaB';

export default function Layout({ children }) {
  const [password, setPassword] = useState(null)
  const [uuid, setUuid] = useState('')

  const hasPassword = () => password && password.length > 0

  const setManagePass = e => {
    const { value } = e.target

    if (value) {
      const bufferpass = Buffer.from(value, 'utf8')
      const base64pass = bufferpass.toString('base64')

      setPassword(value)
      localStorage.setItem('managePass', base64pass)
    }
  }

  const onEnterKeyPress = e => {
    if (e.key === 'Enter') {
      setManagePass(e)
    }
  }

  const router = useRouter()

  useEffect(() => {
    if (router.isReady) {
      if (!uuid) {
        const uuid = initUuid()
        setUuid(uuid)
      }

      const base64pass = localStorage.getItem('managePass')
      if (base64pass) {
        const bufferpass = Buffer.from(base64pass, 'base64')
        const managepass = bufferpass.toString('utf8')
        if (managepass) setPassword(managepass)
      }
    }
  }, [router])

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
          { hasPassword()
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
