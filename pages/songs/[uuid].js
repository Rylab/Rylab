import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { AppContext, getHeaders } from '../_app'
import { baseUrl, siteTitle, tapeColors } from '../../components/Layout'
import { Navigation, TapeAdder, TapeSpinner } from '../../components'
import { validateUuid } from '../../utils/helpers'

const pageTitle = `${siteTitle} :: TapeSpinner Animated React SVG Component Demo`

export default function SongsByUuid() {
  const [canAdd, setCanAdd] = useState(false)
  const { password, uuid } = useContext(AppContext)
  const [songs, setSongs] = useState([])
  const [pageUuid, setPageUuid] = useState({})
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    if (router.isReady) {
      if (router.query.uuid) {
        const decodedUuid = validateUuid(decodeURI(router.query.uuid))

        if (decodedUid) {
          getSongs(decodedUuid)
          setCanAdd(decodedUuid === uuid)
          setPageUuid(decodeURI(decodedUuid))
        }
      }
    }
  }, [router, uuid])

  const getEmbed = songId => {
    window.open(`/song/${songId}`, 'rylab', 'menubar=1,resizable=1,width=600,height=420');
  }

  const getSongs = async targetUuid => {
    try {
      setLoading(true)

      const res = await fetch(`/api/songs/${targetUuid}`, {
        headers: getHeaders({ uuid, password }),
        method: 'GET',
      })
      const songRes = await res.json()
      
      if (songRes.data) {
        songRes.data.map(song => {
          if (typeof tapeColors !== 'undefined' && tapeColors.length && !song.style)
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

  return (
    <>
      <Head>
        <link rel="canonical" href={`${ baseUrl }/songs/${pageUuid}`} />
        <title>{ pageTitle }</title>
        <meta name="og:title" content={ pageTitle } />
        <meta name="description" content="TapeSpinner animated SVG React component demo." />
        <meta property="og:description" content="RyLaB: TapeSpinner animated SVG React component demo." />
      </Head>
      <main>
        <Navigation path={`songs/${pageUuid}`} />
        {!loading && songs?.map(song => {
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

        <TapeAdder />
      </main>
    </>
  )
}
