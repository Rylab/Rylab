import { v4 as uuidv4 } from 'uuid'

// TODO: actual specific DB-side UUID validation, in addition to basic sanity check
const MIN_UUID_LENGTH = 12
const MAX_UUID_LENGTH = 36

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

export const getUuid = req => {
  let uuid = ''

  if (req && req.uuid && req.uuid.length) {
    return validateUuid(req.uuid.trim())
  } else {
    console.warn(req)
    return ''
  }
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
  return (uuid.length >= MIN_UUID_LENGTH && uuid.length <= MAX_UUID_LENGTH) ? uuid : ''
}
