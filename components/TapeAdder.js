import { useContext, useState } from 'react'
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

const addTapeDebug = (tapeInfo) => {
  setLoading(true)

  console.log(tapeInfo)

  setLoading(false)
}

export default function TapeAdder({ addedTapeCount = 0, addTape = addTapeDebug }) {
  const { password, uuid } = useContext(AppContext)
  const [tape, setTape] = useState({})
  const [loading, setLoading] = useState(false)

  if (typeof addTape !== 'function') {
    addTape = addTapeDebug
  }

  const handleAddTape = (event) => {
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
        spin: Math.random() < 0.5,
        style: { backgroundColor: tapeColors[Math.floor(Math.random() * tapeColors.length)] },
        uuid,
      })

      setTape({})
    } else {
      console.error('Title and artist are required.')
      setLoading(false)
    }
  }

  const handleTapeChange = e => {
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
      <TapeSpinner spin={false} style={{backgroundColor: '#888', display: 'block', margin: '10px auto'}}>
        <input
          autoComplete="off"
          name="title"
          className="titleInput"
          maxLength="38"
          placeholder="Title"
          value={tape.title || ''}
          onChange={handleTapeChange} />
        <input
          autoComplete="off"
          name="artist"
          className="artistInput"
          maxLength="36"
          placeholder="Artist"
          value={tape.artist || ''}
          onKeyUp={handleAddTape}
          onChange={handleTapeChange} />
      </TapeSpinner>

      <AddButton
        disabled={loading || !tape.title?.trim() || !tape.artist?.trim()}
        onClick={handleAddTape}>
          Add Tape</AddButton>
    </div>
  )
}
