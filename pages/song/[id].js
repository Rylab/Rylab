import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { AppContext, jsonType } from '../_app'
import { baseUrl, siteTitle, tapeColors } from '../../components/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'
import Navigation from '../../components/Navigation'
import TapeSpinner from '../../components/TapeSpinner'
import { selectText } from '../../utils/helpers'

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

export default function SongDetail() {
  const { password, uuid } = useContext(AppContext)
  const [addedTapeCount, setaddedTapeCount] = useState(0)
  const [canAdd, setCanAdd] = useState(false)
  const [isEmbedding, setIsEmbedding] = useState(false)
  const [song, setSong] = useState({})
  const [tape, setTape] = useState({})
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    const getSong = async _id => {
      try {
        setLoading(true)

        const headers = {
          accept: jsonType,
          'content-type': jsonType,
        }

        if (password) headers['X-Admin'] = password
        if (uuid) headers['X-Uuid'] = uuid

        const res = await fetch(`/api/song/${_id}`, {
          headers,
          data: {
            filter: {
              _id,
            }
          },
          method: 'GET',
        })
  
        const songRes = await res.json()
        
        if (songRes?.data) {
          if (tapeColors?.length && !songRes.data.style)
          songRes.data.style = { backgroundColor: tapeColors[Math.floor(Math.random() * tapeColors.length)] }
          
          setSong({ ...songRes.data })
        } else {
          console.error(res)
        }
        setLoading(false)
      } catch (error) {
        setSong({
          _id: 404,
          artist: '404',
          title: 'Song Not Found',
        })
        setLoading(false)
      }
    }

    if (router.isReady && router.query.id) {
      try {
        getSong(decodeURI(router.query.id))
        setIsEmbedding(router.query.embed)
      } catch(e) {
        console.warn(e)
        setSong({
          _id: 404,
          artist: '404',
          title: 'Song Not Found 0',
        })
      }
    }
  }, [router])

  const getEmbed = songId => {
    window.open(`/song/${songId}`, 'rylab', 'menubar=1,resizable=1,width=350,height=250');
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

  const hasLongArtist = song.artist?.length > 25
  const hasLongTitle = song.title?.length > 25
  
  return (
    <>
      <Head>
        <link rel="canonical" href={`https://${ baseUrl }/song/${ song._id }`} />
        <title>{ pageTitle }</title>
        <meta name="og:title" content={ pageTitle } />
        <meta name="description" content="TapeSpinner animated SVG React component demo." />
        <meta property="og:description" content="RyLaB: TapeSpinner animated SVG React component demo." />
      </Head>
      <main className={isEmbedding ? 'embedding' : ''}>
        <Navigation path={`song/${song._id}`} />
        { song._id ? (
        <>
          <TapeSpinner style={song.style} spin={song.spin} key={song._id} id={`#${song._id}`}>
            <div title={ song.title } onClick={() => getEmbed(song._id)} className={`titleLine${hasLongTitle ? ' long' : ''}`}>
              { song.title }</div>
            <div title={ song.artist } onClick={() => getEmbed(song._id)} className={`artistLine${hasLongArtist ? ' long' : ''}`}>
              { song.artist }</div>
            <div className="songIdLine">{ song._id }</div>
            <div className="uuidLine"><Link href={`/songs/${song.uuid}`}>{ song.uuid }</Link></div>
          </TapeSpinner>
          <div id="embedCodeContainer" className="selectable">
            <h4 style={{ marginBottom: 10, marginTop: 20 }} onClick={() => selectText('embedCode')}>Click to copy embed code</h4>
            <span id="embedCode" onClick={() => selectText('embedCode')}>{`<iframe src="https://${baseUrl}/song/${song._id}?embed=true" />`}</span>
          </div>
        </>
        ) : (
          <LoadingSpinner />
        ) }
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

        {addedTapeCount > 0 && (
        <div className="dark" style={{ marginTop: 33 }}>
          { addedTapeCount } tape{addedTapeCount > 1 && 's'} added{ canAdd ? `; ${MAX_TAPES - addedTapeCount} tapes remain.` : '.' }
        </div>
        )}
      </main>
    </>
  )
}
