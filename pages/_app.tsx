import Head from 'next/head'
import { useRouter } from 'next/router'
import { createContext, JSX, useEffect, useState } from 'react'

import '../styles/global.css'
import Layout from '../components/Layout'
import { initUuid } from '../utils/helpers'

interface ContextProps {
  password: string
  setPassword: (password: string) => void
  showLogin: boolean
  setShowLogin: (show: boolean) => void
  uuid: string
  setUuid: (uuid: string) => void
}

export const AppContext = createContext({
  password: '',
  setPassword: (password: string) => {},
  showLogin: false,
  setShowLogin: (show: boolean) => {},
  uuid: '',
  setUuid: (uuid: string) => {},
})

export const JsonType = 'application/json'

interface HeaderProps {
  uuid: string
  password: string
}

export const getHeaders = ({ uuid, password }: HeaderProps) => {
  const headers = {
    'accept': JsonType,
    'content-type': JsonType,
    'x-uuid': uuid ?? 'anonymous',
    'x-admin': '',
  }

  if (password) headers['x-admin'] = password

  return headers
}

interface AppProps {
  Component: any
  pageProps: any
}

export default function App({ Component, pageProps }: AppProps) {
  const [password, setPassword] = useState('')
  const router = useRouter()
  const [showLogin, setShowLogin] = useState(false)
  const [uuid, setUuid] = useState('')

  const getLayout = Component.getLayout || ((page: JSX.Element) => <Layout>{page}</Layout>)

  useEffect(() => {
    if (router.isReady) {
      if (!uuid) {
        const uuid = initUuid()
        setUuid(uuid)
      }

      const localPass = localStorage.getItem('managePass')

      if (localPass) {
        const bufferPass = Buffer.from(localPass, 'base64')
        const managePass = bufferPass.toString('utf8')

        setPassword(managePass ?? '')
      }
    }
  }, [router]) // eslint-disable-line react-hooks/exhaustive-deps

  const contextValue: ContextProps = {
    password, setPassword,
    showLogin, setShowLogin,
    uuid, setUuid,
  }

  return (
    <AppContext.Provider value={contextValue}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </AppContext.Provider>
  )
}
