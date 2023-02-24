import Head from 'next/head'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { AppContext, getHeaders } from '../_app'
import { baseUrl, siteTitle, tapeColors } from '../../components/Layout'
import { Navigation, TapeAdder, TapeSpinner } from '../../components'

const pageTitle = `${siteTitle} :: TapeSpinner Animated React SVG Component Demo`

const MAX_TAPES = Number.MAX_SAFE_INTEGER

export default function TapeSpinnerDemo() {
  const { password, uuid } = useContext(AppContext)
  const [addedTapeCount, setAddedTapeCount] = useState(0)
  const [canAdd, setCanAdd] = useState(true)
  const [songs, setSongs] = useState([])
  const [tapes, setTapes] = useState({})
  const [loading, setLoading] = useState(true)

  const addTape = ({ _id, artist, title, spin = true, style, uuid }) => {
    if (canAdd) {
      tapes[_id] = {
        artist,
        title,
        spin,
        style,
        uuid,
      }
  
      if (!tapes[_id].style) {
        tapes[_id].style = { backgroundColor: tapeColors[Math.floor(Math.random() * tapeColors.length)] }
      }

      setCanAdd(addedTapeCount < MAX_TAPES)

      setTapes({
        ...tapes,
      })

      if (uuid) {
        setAddedTapeCount(addedTapeCount + 1)
      }
    } else {
      console.warn('canAdd: false')
    }
  }

  const getEmbed = _id => {
    window.open(`/song/${_id}`, 'rylab', 'menubar=1,resizable=1,width=400,height=450')
  }

  const getDemoSongs = async () => {
    try {
      setLoading(true)
  
      const res = await fetch('/api/songs', {
        headers: getHeaders({ uuid, password }),
        method: 'GET',
      })
      const songRes = await res.json()
      
      if (songRes.data) {
        songRes.data.map(song => {
          if (typeof tapeColors !== 'undefined' && !song.style)
          song.style = { backgroundColor: tapeColors[Math.floor(Math.random() * tapeColors.length)] }
        })
        
        setSongs(songRes.data)
      } else {
        console.error(res)
      }

      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  useEffect(() => {
    if (!songs.length) {
      addTape({
        _id: 'demo-song-0000-0001',
        title: 'The Best Song',
        artist: 'The Worst Band',
      })

      addTape({
        _id: 'demo-song-0000-0010',
        title: 'The Worst Snog',
        artist: 'The Best Band',
        spin: false,
      })

      addTape({
        _id: 'demo-song-0000-0011',
        title: 'The Worst Snog With The Best Super Long Name',
        artist: 'The Best Band With The Worst Terrible Long Name',
        spin: false,
      })

      addTape({
        _id: 'demo-song-0000-0100',
        title: 'Loser',
        artist: 'Beck',
      })

      addTape({
        _id: 'demo-song-0000-0101',
        title: 'Once Upon a Thyme',
        artist: 'Pun in the Oven',
      })

      addTape({
        _id: 'demo-song-0000-0110',
        title: '<script>alert("nice try")</script>',
        artist: 'Failed Hacker #2',
        spin: false,
      })

      getDemoSongs()
    }
  }, [addedTapeCount, password, uuid]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Head>
        <link rel="canonical" href={`${ baseUrl }/demos/tapespinner`} />
        <title>{ pageTitle }</title>
        <meta name="og:title" content={ pageTitle } />
        <meta name="description" content="TapeSpinner animated SVG React component demo." />
        <meta property="og:description" content="RyLaB: TapeSpinner animated SVG React component demo." />
      </Head>
      <main>
        <Navigation path="demos/tapespinner" />
        {songs.map(song => {
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

        {!loading && canAdd && <TapeAdder addedTapeCount={addedTapeCount} addTape={addTape} /> }
        <div className="dark" style={{ marginTop: 33 }}>
          { addedTapeCount } tape{addedTapeCount !== 1 && 's'} added
          { canAdd
            ? `; ${MAX_TAPES - addedTapeCount} slot${(addedTapeCount === (MAX_TAPES - 1)) ? '' : 's'} remain${(addedTapeCount === (MAX_TAPES - 1)) ? 's': ''}.`
            : '.' }
        </div>
      </main>
    </>
  )
}
