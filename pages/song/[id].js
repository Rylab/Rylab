import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { AppContext, getHeaders, jsonType } from '../_app'
import { baseUrl, siteTitle, tapeColors } from '../../components/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'
import Navigation from '../../components/Navigation'
import TapeSpinner from '../../components/TapeSpinner'
import { getUserEmbed, selectText } from '../../utils/helpers'

const pageTitle = `${siteTitle} :: TapeSpinner Animated React SVG Component Demo`


export default function SongDetail() {
  const { password, uuid } = useContext(AppContext)
  const [isEmbedding, setIsEmbedding] = useState(false)
  const [song, setSong] = useState({})
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    const getSong = async _id => {
      try {
        setLoading(true)

        const res = await fetch(`/api/song/${_id}`, {
          headers: getHeaders({ uuid, password }),
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
          title: 'Song Not Found',
          uuid: '404',
        })
      }
    }
  }, [router])

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
        { song._id ? (
        <>
          <TapeSpinner style={song.style} spin={song.spin} key={song._id} id={`#${song._id}`}>
            <div title={ song.title } className={`disabled titleLine${hasLongTitle ? ' long' : ''}`}>
              { song.title }</div>
            <div title={ song.artist } className={`disabled artistLine${hasLongArtist ? ' long' : ''}`}>
              { song.artist }</div>
            <div className="uuidLine" onClick={() => getUserEmbed(song.uuid)}><Link href={`/songs/${song.uuid}`}>{ song.uuid }</Link></div>
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
