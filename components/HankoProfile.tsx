'use client'

import { useEffect } from 'react'
import { register } from '@teamhanko/hanko-elements'

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL || ''

export default function HankoProfile() {
  useEffect(() => {
    register(hankoApi).catch((error) => {
      console.error('Failed to register Hanko', error)
    })
  }, [])

  return <hanko-profile />
}
