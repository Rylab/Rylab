import Head from 'next/head'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { AppContext, jsonType } from '../_app'
import { baseUrl, siteTitle, tapeColors } from '../../components/Layout'
import Navigation from '../../components/Navigation'
import TapeSpinner from '../../components/TapeSpinner'

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

const ALLOWED_TAPE_PROPS = ['artist', 'title']
const MAX_TAPES = Number.MAX_SAFE_INTEGER

export default function SpinnerDemo() {
  const { password, uuid } = useContext(AppContext)
  const [addedTapeCount, setaddedTapeCount] = useState(0)
  const [canAdd, setCanAdd] = useState(false)
  const [songs, setSongs] = useState({})
  const [tape, setTape] = useState({})
  const [tapes, setTapes] = useState({})
  const [loading, setLoading] = useState(true)

  const addTape = ({ id, artist, title, spin = true, style }) => {
    if (!canAdd) return;

    tapes[id] = {
      artist,
      title,
      spin,
      style,
    }

    if (!tapes[id].style) {
      tapes[id].style = { backgroundColor: tapeColors[Math.floor(Math.random() * tapeColors.length)] }
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

  const getEmbed = _id => {
    window.open(`/song/${_id}`, 'rylab', 'menubar=1,resizable=1,width=400,height=450');
  }

  const getSongs = async () => {
    try {
      setLoading(true)
  
      const res = await fetch('/api/songs', {
        headers: {
          accept: jsonType,
          'content-type': jsonType,
        },
        method: 'GET',
      })
      const songs = await res.json()
      setLoading(false)
  
      if (songs.data) {
        songs.data.map(song => {
          if (typeof tapeColors !== 'undefined' && !song.style)
            song.style = { backgroundColor: tapeColors[Math.floor(Math.random() * tapeColors.length)] }
        })

        setSongs({ data: songs.data })
      } else {
        console.error(res)
      }
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  useEffect(() => {
    if (!addedTapeCount) {
      addTape({
        _id: 'fake-uuid-0001',
        title: 'The Best Song',
        artist: 'The Worst Band',
      })

      addTape({
        _id: 'fake-uuid-0010',
        title: 'The Worst Snog',
        artist: 'The Best Band',
        spin: false,
      })

      addTape({
        _id: 'fake-uuid-0011',
        title: 'The Worst Snog With The Best Super Long Name',
        artist: 'The Best Band With The Worst Terrible Long Name',
        spin: false,
      })

      addTape({
        _id: 'fake-uuid-0100',
        title: 'Loser',
        artist: 'Beck',
      })

      addTape({
        _id: 'fake-uuid-0101',
        title: 'Once Upon a Thyme',
        artist: 'Pun in the Oven',
      })

      addTape({
        _id: 'fake-uuid-0110',
        title: '<script>alert("nice try")</script>',
        artist: 'Failed Hacker #2',
        spin: false,
      })

      setCanAdd(true)

      getSongs()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
        {songs.data?.map(song => {
          const hasLongArtist = song.artist.length > 25
          const hasLongTitle = song.title.length > 25

          return (
            <TapeSpinner style={song.style} spin={song.spin} key={song._id} id={`#${song._id}`}>
              <div title={ song.title } onClick={() => getEmbed(song._id)} className={`titleLine${hasLongTitle ? ' long' : ''}`}>
                { song.title }</div>
              <div title={ song.artist } onClick={() => getEmbed(song._id)} className={`artistLine${hasLongArtist ? ' long' : ''}`}>
                { song.artist }</div>
              <div className="songIdLine" onClick={() => getEmbed(song._id)}>{ song._id }</div>
              <div className="uuidLine"><Link href={`/songs/${song.uuid}`}>{ song.uuid }</Link></div>
            </TapeSpinner>
          )
        })}
        {Object.keys(tapes).map(tapeKey => {
          const hasLongArtist = tapes[tapeKey].artist.length > 25
          const hasLongTitle = tapes[tapeKey].title.length > 25

          return (
            <TapeSpinner style={tapes[tapeKey].style} spin={tapes[tapeKey].spin} key={tapeKey} id={`#${tapeKey}`}>
              <div title={ hasLongTitle ? tapes[tapeKey].title : '' } className={`titleLine${hasLongTitle ? ' long' : ''}`}>
                { tapes[tapeKey].title }</div>
              <div title={ hasLongArtist ? tapes[tapeKey].artist : '' } className={`artistLine${hasLongArtist ? ' long' : ''}`}>
                { tapes[tapeKey].artist }</div>
                <div className={`songIdLine`} onClick={() => getEmbed(tapes[tapeKey]._id)}>{ tapes[tapeKey]._id }</div>
              <div className={`uuidLine`} onClick={() => getEmbed(tapeKey)}>{ tapeKey }</div>
            </TapeSpinner>
          )
        })}

        {canAdd && (
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
