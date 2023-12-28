export const MAX_LINE_LENGTH = 23

export const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_URI
  ? process.env.NEXT_PUBLIC_BASE_URI.toString().trim() : 'localhost'

export const BASE_PORT = process.env.NEXT_PUBLIC_BASE_PORT
  ? parseInt(process.env.NEXT_PUBLIC_BASE_PORT, 10) : 443

export const BASE_URL = `http${BASE_PORT === 443 ? 's':''}://${BASE_DOMAIN}${[80,443].includes(BASE_PORT) ? '': `:${BASE_PORT }`}`

export const SITE_TITLE = 'RyLaB'
