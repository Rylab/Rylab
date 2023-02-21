import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import '../styles/global.css'
import Layout from '../components/Layout'
import { initUuid } from '../utils/helpers'

export const AppContext = createContext({})
export const jsonType = 'application/json'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [uuid, setUuid] = useState('')

  const getLayout = Component.getLayout || (page => <Layout>{page}</Layout>)

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

        setPassword(managePass ?? null)
      }
    }
  }, [router]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppContext.Provider value={{ password, uuid, setPassword, setUuid }}>
    { getLayout(<Component {...pageProps} />) }
    </AppContext.Provider>
  )
}
