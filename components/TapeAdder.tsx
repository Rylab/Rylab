import { ChangeEvent, CSSProperties, KeyboardEvent, MouseEventHandler, useContext, useState } from 'react'
import styled from 'styled-components'

import { AppContext } from '../pages/_app'
import { tapeColors } from './Layout'
import { TapeSpinner } from '.'

const AddButton = styled.button`
  border-radius: 20px;
  font-size: 14pt;
  margin-top: 7px;
  padding: 8px 20px;

  &:disabled {
    color: #555;
    background-color: #aaa;
  }

  &:hover:not(:disabled) {
    background-color: #fff;
    color: #222;
  }

  &:active:not(:disabled), &:focus:not(:disabled) {
    background-color: #555;
    color: #eee;
  }
`

const ALLOWED_TAPE_PROPS = ['artist', 'title']
const emptyTape = { artist: '', title: '' }

interface TapeAdderProps {
  addedTapeCount?: number
  addTape?(tapeInfo: Tape): void
}

interface Tape {
  _id?: string
  artist?: string
  title?: string
  spin?: boolean
  style?: CSSProperties
  uuid?: string
}

export default function TapeAdder({ addedTapeCount = 0, addTape = (tapeInfo: Tape) => {} }: TapeAdderProps) {
  const { password, uuid } = useContext(AppContext)
  const [tape, setTape] = useState(emptyTape)
  const [loading, setLoading] = useState(false)

  const addTapeDebug = (tapeInfo: Tape) => {
    setLoading(true)

    console.log(tapeInfo)

    setLoading(false)
  }

  if (typeof addTape !== 'function') {
    addTape = addTapeDebug
  }

  const handleAddTape = (event: KeyboardEvent) => {
    if (event?.type === 'keyup' && event?.key !== 'Enter') {
      return
    }

    const artist = tape.artist?.trim()
    const title = tape.title?.trim()

    if (artist && title) {
      const _id = `localtape-0000-0000-${String(addedTapeCount + 1).padStart(4, '0')}`

      addTape({
        _id,
        artist,
        title,
        spin: true,
        style: { backgroundColor: tapeColors[Math.floor(Math.random() * tapeColors.length)] },
        uuid,
      })

      setTape(emptyTape)
    } else {
      console.error('Title and artist are required.')
      setLoading(false)
    }
  }

  const handleAddTapeClick: MouseEventHandler = () => {
    handleAddTape({ type: 'keyup', key: 'Enter' } as KeyboardEvent)
  }

  const handleTapeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (ALLOWED_TAPE_PROPS.includes(name)) {
      setTape({
        ...tape,
        [name]: value,
      })
    }
  }

  return (
    <div style={{ marginTop: 50 }}>
      <h3>Add a tape to the collection</h3>
      <TapeSpinner spin={false} style={{ backgroundColor: '#888', display: 'block', margin: '10px auto' }}>
        <input
          autoComplete="off"
          name="title"
          className="titleInput"
          maxLength={38}
          placeholder="Title"
          value={tape.title || ''}
          onChange={handleTapeChange}
          onClick={e => e.stopPropagation() }
        />
        <input
          autoComplete="off"
          name="artist"
          className="artistInput"
          maxLength={36}
          placeholder="Artist"
          value={tape.artist || ''}
          onKeyUp={handleAddTape}
          onChange={handleTapeChange}
          onClick={e => e.stopPropagation() }
        />
      </TapeSpinner>

      <AddButton
        disabled={loading || !tape.title?.trim() || !tape.artist?.trim()}
        onClick={handleAddTapeClick}>
        Add Tape</AddButton>
    </div>
  )
}
