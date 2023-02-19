import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import TapeSpinner from '../../components/cassetteTapeSpinner'
import { baseUrl, jsonContentType, siteTitle } from '../../components/layout'
import Navigation from '../../components/navigation'
import { initUuid, tapeColors } from '../../utils/helpers'

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

export default function SongsByUuid() {
  const [addedTapeCount, setaddedTapeCount] = useState(0)
  const [canAdd, setCanAdd] = useState(false)
  const [songs, setSongs] = useState({})
  const [tape, setTape] = useState({})
  const [targetUuid, setTargetUuid] = useState({})
  const [uuid, setUuid] = useState({})
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    if (router.isReady) {
      const targetUuid = router.query.uuid

      if (!uuid) {
        const uuid = initUuid()
        setUuid(uuid)
      }

      if (targetUuid) {
        setTargetUuid(decodeURI(targetUuid))
        getSongs(targetUuid)
        setCanAdd(targetUuid === uuid)
      }
    }
  }, [router])

  const getEmbed = songId => {
    window.open(`/song/${songId}`, 'rylab', 'menubar=1,resizable=1,width=600,height=420');
  }

  const getSongs = async uuid => {
    try {
      setLoading(true)

      const res = await fetch(`/api/songs/${uuid}`, {
        headers: {
          accept: jsonContentType,
          'content-type': jsonContentType,
          'x-admin': localStorage.getItem('managePass'),
        },
        data: {
          filter: {
            uuid,
          }
        },
        method: 'GET',
      })

      const songs = await res.json()
      setLoading(false)

      if (songs.data) {
        songs.data.map(song => {
          if (typeof tapeColors !== 'undefined' && tapeColors.length && !song.style)
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
    <>
      <Head>
        <link rel="canonical" href={`https://${ baseUrl }/songs/${targetUuid}`} />
        <title>{ pageTitle }</title>
        <meta name="og:title" content={ pageTitle } />
        <meta name="description" content="TapeSpinner animated SVG React component demo." />
        <meta property="og:description" content="RyLaB: TapeSpinner animated SVG React component demo." />
      </Head>
      <main>
        <Navigation path={`songs/${targetUuid}`} />
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