import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { AppContext, getHeaders } from '../_app'
import { baseUrl, siteTitle, tapeColors } from '../../components/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'
import Navigation from '../../components/Navigation'
import TapeSpinner from '../../components/TapeSpinner'
import { getUserEmbed, selectText } from '../../utils/helpers'

const pageTitle = `${siteTitle} :: TapeSpinner Animated React SVG Component Demo`

type Song = {
  _id: string
  artist: string
  spin?: boolean
  style?: React.CSSProperties
  title: string
  uuid?: string
}

export default function SongDetail() {
  const { password, uuid } = useContext(AppContext)
  const [isEmbedding, setIsEmbedding] = useState(false)
  const [song, setSong] = useState({} as Song)
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    const getSong = async _id => {
      try {
        setLoading(true)

        const res = await fetch(`/api/song/${_id}`, {
          headers: getHeaders({ uuid, password }),
          method: 'GET',
        })
  
        const songRes = await res.json()
        
        if (songRes?.data) {
          const song: Song = songRes.data

          if (tapeColors?.length && !songRes.data.style)
          song.style = { backgroundColor: tapeColors[Math.floor(Math.random() * tapeColors.length)] }
          
          setSong({ ...song })
        } else {
          console.error(res)
        }
        setLoading(false)
      } catch (error) {
        setSong({
          _id: '0404',
          artist: '404',
          title: 'Song Not Found',
        })
        setLoading(false)
      }
    }

    if (router.isReady && router.query.id?.length) {
      try {
        getSong(decodeURI(router.query.id.toString()))
        setIsEmbedding(router.query.embed === 'true')
      } catch(e) {
        console.warn(e)
        setSong({
          _id: '0404',
          artist: '404',
          title: 'Song Not Found',
          uuid: '404',
        })
      }
    }
  }, [router]) // eslint-disable-line react-hooks/exhaustive-deps

  const hasLongArtist = song.artist?.length > 25
  const hasLongTitle = song.title?.length > 25
  
  return (
    <>
      <Head>
        <link rel="canonical" href={`${ baseUrl }/song/${ song._id ?? '404' }`} />
        <title>{ pageTitle }</title>
        <meta name="og:title" content={ pageTitle } />
        <meta name="description" content="TapeSpinner animated SVG React component demo." />
        <meta property="og:description" content="RyLaB: TapeSpinner animated SVG React component demo." />
      </Head>
      <main className={isEmbedding ? 'embedding' : ''}>
        <Navigation path={`song/${song._id}`} />
        { !loading && song._id ? (
        <>
          <TapeSpinner style={song.style} spin={song.spin} key={song._id} id={`#${song._id}`}>
            <div title={ song.title } className={`disabled titleLine${hasLongTitle ? ' long' : ''}`}>
              { song.title }</div>
            <div title={ song.artist } className={`disabled artistLine${hasLongArtist ? ' long' : ''}`}>
              { song.artist }</div>
            <div className="uuidLine" onClick={() => getUserEmbed(song.uuid)}><Link href={`/song/${song.uuid}`}>{ song.uuid }</Link></div>
            <div className="disabled songIdLine">{ song._id }</div>
          </TapeSpinner>
          <div className="embedCodeContainer selectable">
            <h4 onClick={() => selectText('embedCode')}>Click to copy embed code</h4>
            <span className="embedCode" onClick={() => selectText('embedCode')}>{`<iframe src="https://${baseUrl}/song/${song._id}?embed=true" />`}</span>
          </div>
        </>
        ) : (
          <LoadingSpinner />
        ) }
      </main>
    </>
  )
}
