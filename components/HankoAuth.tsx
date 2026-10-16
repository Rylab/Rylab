'use client'

import { useEffect, useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { Hanko, register } from '@teamhanko/hanko-elements'
import HankoLoggedIn from './HankoLoggedIn'

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL || ''

export default function HankoAuth() {
  const router = useRouter()

  const [hanko, setHanko] = useState<Hanko>()
  const [loggedIn, setLoggedIn] = useState(false)

  const redirectAfterLogin = useCallback(() => {
    router.replace('/1')
  }, [router]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    register(hankoApi)
      .then(async ({ hanko }) => {
        setHanko(hanko)

        hanko.onSessionCreated(() => {
          redirectAfterLogin()
        })
        hanko.onSessionExpired(() => {
          setLoggedIn(false)
        })
        hanko.onUserLoggedOut(() => {
          setLoggedIn(false)
        })

        const session = await hanko.validateSession()
        setLoggedIn(session.is_valid)
      })
      .catch((error) => {
        console.error('Failed to login', error)
      })
  }, [redirectAfterLogin])

  return loggedIn && hanko ? <HankoLoggedIn hanko={hanko} /> : <hanko-auth />
}
