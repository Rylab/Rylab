import { v4 as uuidv4 } from 'uuid'

export function selectText(id) {
  let nav
  let sel

  try {
    if (window.getSelection && document.createRange) {
      nav = document.getElementById(id)
      sel = window.getSelection()

      window.setTimeout(() => {
        let range = document.createRange()
        range.selectNodeContents(nav)
        sel.removeAllRanges()
        sel.addRange(range)
        document.execCommand('copy')
        console.log(`${sel.toString()} [copied]`)
      })
    }
  } catch (e) {
    console.warn('Text selection or clipboard usage not supported.')
  }
}

export const tapeColors = [
  '#777',
  'rgb(238, 231, 200)',
  'rgb(111, 231, 200)',
  'rgb(198, 131, 200)',
  'rgb(198, 231, 100)',
  '#999',
  'rgba(255, 0, 0, 0.3)',
  'rgba(0, 255, 0, 0.3)',
  'rgba(0, 0, 255, 0.3)',
]

export const getUuid = req => {
  const uuid = req.body?.uuid?.trim()

  return uuid ? validateUuid(uuid) : ''
}

export const initUuid = () => {
  let uuid = localStorage.getItem('uuid')

  if (uuid) return uuid

  uuid = uuidv4()

  try {
    localStorage.setItem('uuid', uuid)

    return uuid
  } catch (e) {
    console.error(e)

    alert('A browser supporting localStorage is required.')
  }
}

export const validateUuid = uuid => {
  return (uuid?.length === UUID_LENGTH) ? uuid : false
}
