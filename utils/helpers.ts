import { v4 as uuidv4 } from 'uuid'

// TODO: actual specific DB-side UUID validation via auth helper, in addition to basic sanity check
const MIN_UUID_LENGTH = 12
const MAX_UUID_LENGTH = 36

export function selectText(className) {
  let nav
  let sel

  try {
    // basic browser compatibility check
    if (window.getSelection && document.getElementsByClassName && document.createRange) {
      nav = document.getElementsByClassName(className)[0]
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
    console.warn('Text selection or clipboard usage not fully supported.')
  }
}

export const getUuid = req => {
  let uuid = ''

  if (req && req.uuid && req.uuid.length) {
    return validateUuid(req.uuid)
  } else {
    console.warn(req)
    return ''
  }
}

export const getSongEmbed = _id => {
  window.open(`/song/${_id}`, 'rylab', 'menubar=1,resizable=1,width=400,height=450')
}

export const getUserEmbed = _uuid => {
  window.open(`/user/${_uuid}`, 'rylab', 'menubar=1,resizable=1,width=400,height=450')
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
  let trimUuid = ''

  if (!uuid || typeof uuid !== 'string') return trimUuid

  trimUuid = uuid.trim()

  return (trimUuid.length >= MIN_UUID_LENGTH && trimUuid.length <= MAX_UUID_LENGTH) ? trimUuid : ''
}
