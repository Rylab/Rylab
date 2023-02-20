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
  
    setPassword(value)
  
    if (value) {
      localStorage.setItem('managePass', value)
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

      setPassword(localStorage.getItem('managePass'))
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
            <div className="adminCheck">
              <input type="password"
                className="dark"
                name="managePassword"
                style={{ marginTop: 20 }}
                onKeyPress={onEnterKeyPress} />
            </div>
          }
        </div>
    </>
  )
}
