import { v4 as uuidv4 } from 'uuid'

export function selectText(className: string) {
  let nav: Element
  let sel: Selection|null

  try {
    // basic browser compatibility check
    if (window.getSelection && document.getElementsByClassName && document.createRange) {
      nav = document.getElementsByClassName(className)[0]
      sel = window.getSelection()

      window.setTimeout(() => {
        if (sel instanceof Selection) {
          let range = document.createRange()
          range.selectNodeContents(nav)
          sel.removeAllRanges()
          sel.addRange(range)
          document.execCommand('copy')
          console.log(`${sel.toString()} [copied]`)
        }
      })
    }
  } catch (e) {
    console.warn('Text selection or clipboard usage not fully supported.')
  }
}

export const getUuid = (req: { uuid?: string }): string => {
  if (req.uuid?.length) {
    return validateUuid(req.uuid)
  } else {
    console.warn(req)
    return ''
  }
}

export const getSongEmbed = (_id: string|undefined) => {
  if (_id) window.open(`/song/${_id}`, 'rylab', 'menubar=1,resizable=1,width=400,height=450')
}

export const getUserEmbed = (_uuid: string|undefined) => {
  if (_uuid) window.open(`/user/${_uuid}`, 'rylab', 'menubar=1,resizable=1,width=400,height=450')
}

export const initUuid = (): string => {
  let uuid = validateUuid(localStorage.getItem('uuid') ?? '')

  if (uuid) return uuid

  uuid = uuidv4()

  try {
    localStorage.setItem('uuid', uuid)

    return uuid
  } catch (e) {
    console.error(e)

    alert('A browser supporting localStorage is required.')

    return ''
  }
}

export const validateUuid = (uuid?: string|string[]): string => {
  const MIN_UUID_LENGTH = 12
  const MAX_UUID_LENGTH = 36

  if (!uuid || typeof uuid !== 'string' || uuid.length < MIN_UUID_LENGTH || uuid.length > MAX_UUID_LENGTH) return ''

  let safeUuid = uuid.replace(/[^a-z0-9\-]+$/gi, '')

  return safeUuid.length >= MIN_UUID_LENGTH ? safeUuid : ''
}
