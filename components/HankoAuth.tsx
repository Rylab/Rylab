'use client'

import { useEffect, useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { Hanko, register } from '@teamhanko/hanko-elements'

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL || ''

export default function HankoAuth() {
  const router = useRouter()

  const [hanko, setHanko] = useState<Hanko>()

  useEffect(() => setHanko(new Hanko(hankoApi)), [])

  const redirectAfterLogin = useCallback(() => {
    router.replace('/1')
  }, [router]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(
    () => {
      hanko?.onSessionCreated(() => {
        redirectAfterLogin()
      })
      hanko?.onSessionCreated(() => {
        redirectAfterLogin()
      })
      hanko?.onSessionExpired(() => {
        router.reload()
      })
    }, [hanko, redirectAfterLogin]
  )

  useEffect(() => {
    register(hankoApi).catch((error) => {
      console.error('Failed to login', error)
    })
  }, [])

  return <HankoAuth />
}
