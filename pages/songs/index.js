import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { AppContext, getHeaders } from '../_app'
import { baseUrl, siteTitle, tapeColors } from '../../components/Layout'
import { Navigation, TapeAdder, TapeSpinner } from '../../components'
import { MAX_LINE_LENGTH } from '../../utils/constants'
import { getSongEmbed, getUserEmbed } from '../../utils/helpers'

const pageTitle = `${siteTitle} :: TapeSpinner Animated React SVG Component Demo :: Hot Songs`

export default function SongList() {
  const { password, uuid } = useContext(AppContext)
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)

  const getSongs = async () => {
    try {
      setLoading(true)

      const res = await fetch('/api/songs', {
        headers: getHeaders({ uuid, password }),
        method: 'GET',
      })

      const songRes = await res.json()
      
      if (songRes?.data) {
        songRes.data.map(song => {
          if (!song.style) song.style = { backgroundColor: tapeColors[Math.floor(Math.random() * tapeColors.length)] }
        })

        setSongs(songRes.data)
      } else {
        setSongs([])
        console.error(res)
      }

      setLoading(false)
    } catch (error) {
      setSongs([])
      setLoading(false)
      console.error(error)
    }
  }

  useEffect(() => {
    getSongs()
  }, [password, uuid])

  return (
    <>
      <Head>
        <link rel="canonical" href={`${ baseUrl }/songs`} />
        <title>{ pageTitle }</title>
        <meta name="og:title" content={ pageTitle } />
        <meta name="description" content="TapeSpinner animated SVG React component demo." />
        <meta property="og:description" content="RyLaB: TapeSpinner animated SVG React component demo." />
      </Head>
      <main>
        <Navigation path={'songs'} />
        {songs.map(song => {
          const hasLongArtist = song.artist?.length > MAX_LINE_LENGTH
          const hasLongTitle = song.title?.length > MAX_LINE_LENGTH

          return (
            <TapeSpinner style={song.style} spin={song.spin} key={song._id} id={`#${song._id}`}>
              <div title={ song.title } className={`titleLine${hasLongTitle ? ' long' : ''}`}>
                { song.title }</div>
              <div title={ song.artist } className={`artistLine${hasLongArtist ? ' long' : ''}`}>
                { song.artist }</div>
              <div className="uuidLine" onClick={() => getUserEmbed(song.uuid)}>{ song.uuid }</div>
              <div className="songIdLine" onClick={() => getSongEmbed(song._id)}>{ song._id }</div>
            </TapeSpinner>
          )
        })}
        <TapeAdder />
      </main>
    </>
  )
}
