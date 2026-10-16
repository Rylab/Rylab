import { Song } from '../types'

const uuidv4 = (): string => crypto.randomUUID()

export function selectText(className: string) {
  let nav: Element
  let sel: Selection | null

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

const LOCAL_TAPES_KEY = 'localTapes'
const TAPE_DB_NAME = 'rylab'
const TAPE_DB_STORE = 'localTapes'

let tapeDb: Promise<IDBDatabase | null> | null = null

const openTapeDb = (): Promise<IDBDatabase | null> => {
  if (!tapeDb) {
    tapeDb = new Promise(resolve => {
      try {
        if (!window.indexedDB) return resolve(null)

        const request = indexedDB.open(TAPE_DB_NAME, 1)

        request.onupgradeneeded = () => request.result.createObjectStore(TAPE_DB_STORE)
        request.onsuccess = () => resolve(request.result)
        request.onerror = request.onblocked = () => resolve(null)
      } catch {
        resolve(null)
      }
    })
  }

  return tapeDb
}

const readLocalStorageTapes = (): { [key: string]: Song } => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_TAPES_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export const loadLocalTapes = async (): Promise<{ [key: string]: Song }> => {
  const db = await openTapeDb()

  if (!db) return readLocalStorageTapes()

  return new Promise<{ [key: string]: Song }>((resolve, reject) => {
    const tx = db.transaction(TAPE_DB_STORE, 'readonly')
    const store = tx.objectStore(TAPE_DB_STORE)
    const keys = store.getAllKeys()
    const values = store.getAll()

    tx.oncomplete = () => {
      const result: { [key: string]: Song } = {}
      keys.result.forEach((key, i) => {
        result[String(key)] = values.result[i]
      })
      resolve(result)
    }
    tx.onerror = tx.onabort = () => reject(tx.error)
  })
}

export const saveLocalTape = async (_id: string, tape: Song): Promise<void> => {
  const db = await openTapeDb()

  if (db) {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(TAPE_DB_STORE, 'readwrite')
      tx.objectStore(TAPE_DB_STORE).put(tape, _id)
      tx.oncomplete = () => resolve()
      tx.onerror = tx.onabort = () => reject(tx.error)
    })

    return
  }

  const tapes = readLocalStorageTapes()
  tapes[_id] = tape
  localStorage.setItem(LOCAL_TAPES_KEY, JSON.stringify(tapes))
}

export const validateUuid = (uuid?: string|string[]): string => {
  const MIN_UUID_LENGTH = 12
  const MAX_UUID_LENGTH = 36

  if (!uuid || typeof uuid !== 'string' || uuid.length < MIN_UUID_LENGTH || uuid.length > MAX_UUID_LENGTH) return ''

  let safeUuid = uuid.replace(/[^a-z0-9\-]+$/gi, '')

  return safeUuid.length >= MIN_UUID_LENGTH ? safeUuid : ''
}
