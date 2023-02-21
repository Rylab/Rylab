import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { AppContext, jsonType } from '../_app'
import { baseUrl, siteTitle, tapeColors } from '../../components/Layout'
import Navigation from '../../components/Navigation'
import TapeSpinner from '../../components/TapeSpinner'

const pageTitle = `${siteTitle} :: TapeSpinner Animated React SVG Component Demo :: Hot Songs`

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

export default function SongDetail() {
  const [addedTapeCount, setaddedTapeCount] = useState(0)
  const [canAdd, setCanAdd] = useState(false)
  const [songs, setSongs] = useState({})
  const [tape, setTape] = useState({})
  const [loading, setLoading] = useState(true)

  const openEmbedLink = song => {
    window.open(`/song/${song._id}`, 'rylab', 'menubar=1,resizable=1,width=350,height=250')
  }

  const getSongs = async () => {
    try {
      setLoading(true)

      const res = await fetch('/api/songs', {
        headers: {
          accept: jsonType,
          'content-type': jsonType,
          'x-admin': password,
          'x-uuid': uuid,
        },
        method: 'GET',
      })

      const songRes = await res.json()
      
      if (songRes.data) {
        songRes.data.map(song => {
          if (!song.style) song.style = { backgroundColor: tapeColors[Math.floor(Math.random() * tapeColors.length)] }
        })

        setSongs({ data: songRes.data })
      } else {
        console.error(res)
      }

      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error)
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
      _id: 'fake-uuid-0001',
      title: 'The Best Song',
      artist: 'The Worst Band',
      style: { backgroundColor: tapeColors[1] },
    })

    addTape({
      _id: 'fake-uuid-0010',
      title: 'The Worst Snog',
      artist: 'The Best Band',
      spin: false,
      style: { backgroundColor: tapeColors[2] },
    })

    addTape({
      _id: 'fake-uuid-0011',
      title: 'The Worst Snog With The Best Super Long Name',
      artist: 'The Best Band With The Worst Terrible Long Name',
      spin: false,
      style: { backgroundColor: tapeColors[3] },
    })

    addTape({
      _id: 'fake-uuid-0100',
      title: 'Loser',
      artist: 'Beck',
      style: { backgroundColor: tapeColors[4] },
    })

    addTape({
      _id: 'fake-uuid-0101',
      title: 'Once Upon a Thyme',
      artist: 'Pun in the Oven',
      style: { backgroundColor: tapeColors[5] },
    })

    addTape({
      _id: 'fake-uuid-0110',
      title: '<script>alert("nice try")</script>',
      artist: 'Failed Hacker #2',
      style: { backgroundColor: tapeColors[6] },
      spin: false,
    })

    setCanAdd(true)
    getSongs()
  }, [])
  
  return (
    <>
      <Head>
        <link rel="canonical" href={`https://${ baseUrl }/songs`} />
        <title>{ pageTitle }</title>
        <meta name="og:title" content={ pageTitle } />
        <meta name="description" content="TapeSpinner animated SVG React component demo." />
        <meta property="og:description" content="RyLaB: TapeSpinner animated SVG React component demo." />
      </Head>
      <main>
        <Navigation path={'songs'} />
        {songs.data && songs.map(song => {
          const hasLongArtist = song.artist?.length > 25
          const hasLongTitle = song.title?.length > 25

          return (
            <TapeSpinner style={song.style} spin={song.spin} key={song._id} id={`#${song._id}`}>
              <div title={ song.title } className={`titleLine${hasLongTitle ? ' long' : ''}`}>
                { song.title }</div>
              <div title={ song.artist } className={`artistLine${hasLongArtist ? ' long' : ''}`}>
                { song.artist }</div>
              <div className="songIdLine" onClick={() => openEmbedLink(song._id)}>{ song._id }</div>
              <Link href={`/songs/${song.uuid}`}><div className="uuidLine" onClick={() => getUserTapes(song)}>{ song.uuid }</div></Link>
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
