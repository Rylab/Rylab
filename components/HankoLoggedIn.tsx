'use client'

import { useEffect, useState } from 'react'
import { Hanko, User } from '@teamhanko/hanko-elements'

interface HankoLoggedInProps {
  hanko: Hanko
}

export default function HankoLoggedIn({ hanko }: HankoLoggedInProps) {
  const [user, setUser] = useState<User>()

  useEffect(() => {
    hanko.getCurrentUser()
      .then(setUser)
      .catch((error) => {
        console.error('Failed to fetch user', error)
      })
  }, [hanko])

  const primaryEmail = user?.emails?.find(e => e.is_primary)?.address ?? user?.emails?.[0]?.address
  const displayName = user?.username?.username || primaryEmail || user?.user_id

  return (
    <div>
      <p>Logged in{displayName ? ` as ${displayName}` : ''}</p>
      <button onClick={() => hanko.logout().catch(e => console.error(e))}>
        Log out</button>
    </div>
  )
}
