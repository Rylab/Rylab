import Head from 'next/head'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import TapeSpinner from '../../components/cassetteTapeSpinner'
import { baseUrl, siteTitle } from '../../components/layout'
import Navigation from '../../components/navigation'

const pageTitle = `${siteTitle} :: TapeSpinner Animated React SVG Component Demo`

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

const tapeColors = [
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

const ALLOWED_TAPE_PROPS = ['artist', 'title']
const MAX_TAPES = Number.MAX_SAFE_INTEGER

export default function SpinnerDemo() {
  const [addedTapeCount, setaddedTapeCount] = useState(0)
  const [canAdd, setCanAdd] = useState(false)
  const [tape, setTape] = useState({})
  const [tapes, setTapes] = useState({})

  const addTape = ({ id, artist, title, spin = true, style }) => {
    tapes[id] = {
      artist,
      title,
      spin,
      style,
    }

    setTapes({
      ...tapes,
    })
  }

  const handleAddTape = (event) => {
    if (!canAdd || (event?.type === 'keyup' && event?.key !== 'Enter')) {
      return
    }

    const artist = tape.artist?.trim()
    const title = tape.title?.trim()

    if (artist && title) {
      const id = `tid-${addedTapeCount}`

      addTape({
        id,
        artist,
        title,
        spin: Math.random() < 0.5,
        style: { backgroundColor: tapeColors[Math.floor(Math.random() * tapeColors.length)] },
      })

      setaddedTapeCount(addedTapeCount + 1)

      if (addedTapeCount >= MAX_TAPES) {
        setCanAdd(false)
      }

      setTape({})
    } else {
      console.error('Title and artist are required.')
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

  useEffect(() => {
    addTape({
      id: 'fake-uuid-0001',
      title: 'The Best Song',
      artist: 'The Worst Band',
      style: { backgroundColor: tapeColors[1] },
    })

    addTape({
      id: 'fake-uuid-0010',
      title: 'The Worst Snog',
      artist: 'The Best Band',
      spin: false,
      style: { backgroundColor: tapeColors[2] },
    })

    addTape({
      id: 'fake-uuid-0011',
      title: 'The Worst Snog With The Best Super Long Name',
      artist: 'The Best Band With The Worst Terrible Long Name',
      spin: false,
      style: { backgroundColor: tapeColors[3] },
    })

    addTape({
      id: 'fake-uuid-0100',
      title: 'Loser',
      artist: 'Beck',
      style: { backgroundColor: tapeColors[4] },
    })

    addTape({
      id: 'fake-uuid-0101',
      title: 'Once Upon a Thyme',
      artist: 'Pun in the Oven',
      style: { backgroundColor: tapeColors[5] },
    })

    addTape({
      id: 'fake-uuid-0110',
      title: '<script>alert("nice try")</script>',
      artist: 'Failed Hacker #2',
      style: { backgroundColor: tapeColors[6] },
      spin: false,
    })

    setCanAdd(true)
  }, [])

  return (
    <>
      <Head>
        <link rel="canonical" href={`https://${ baseUrl }/demos/tapespinner`} />
        <title>{ pageTitle }</title>
        <meta name="og:title" content={ pageTitle } />
        <meta name="description" content="TapeSpinner animated SVG React component demo." />
        <meta property="og:description" content="RyLaB: TapeSpinner animated SVG React component demo." />
      </Head>
      <main>
        <Navigation path='demos/tapespinner' />

        {Object.keys(tapes).map(tapeKey => {
          const hasLongArtist = tapes[tapeKey].artist.length > 25
          const hasLongTitle = tapes[tapeKey].title.length > 25

          return (
            <TapeSpinner style={tapes[tapeKey].style} spin={tapes[tapeKey].spin} key={tapeKey} id={`#${tapeKey}`}>
              <div title={ hasLongTitle ? tapes[tapeKey].title : '' } className={`titleLine${hasLongTitle ? ' long' : ''}`}>
                { tapes[tapeKey].title }</div>
              <div title={ hasLongArtist ? tapes[tapeKey].artist : '' } className={`artistLine${hasLongArtist ? ' long' : ''}`}>
                { tapes[tapeKey].artist }</div>
            </TapeSpinner>
          )
        })}

        {canAdd && (
        <div style={{ marginTop: 50 }}>
          <h3>Add a tape to the collection:</h3>
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
            disabled={!tape.title?.trim() || !tape.artist?.trim()}
            onClick={handleAddTape}>
              Add Tape</AddButton>
        </div>
        )}

        {addedTapeCount && (
        <div className="dark" style={{ marginTop: 33 }}>
          { addedTapeCount } tape{addedTapeCount > 1 && 's'} added{ canAdd ? `; ${MAX_TAPES - addedTapeCount} tapes remain.` : '.' }
        </div>
        )}
      </main>
    </>
  )
}
