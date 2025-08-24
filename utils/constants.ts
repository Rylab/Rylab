export const MAX_LINE_LENGTH = 23

export const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_URI
  ? process.env.NEXT_PUBLIC_BASE_URI.toString().trim() : 'localhost'

export const BASE_PORT = process.env.NEXT_PUBLIC_BASE_PORT
  ? parseInt(process.env.NEXT_PUBLIC_BASE_PORT, 10) : 3000

export const IS_SECURE = process.env.NEXT_PUBLIC_SECURE_PROXY
  ? process.env.NEXT_PUBLIC_SECURE_PROXY.toString().trim() === 'true' || [443, 8443].includes(BASE_PORT)
  : false

export const BASE_URL = `http${IS_SECURE ? 's' : ''}://${BASE_DOMAIN}`
  + `${(IS_SECURE || [80, 443].includes(BASE_PORT)) ? '' : `:${BASE_PORT}`}`

export const SITE_TITLE = process.env.NEXT_PUBLIC_SITE_TITLE
  ? process.env.NEXT_PUBLIC_SITE_TITLE.toString().trim() : 'RyLaB'
