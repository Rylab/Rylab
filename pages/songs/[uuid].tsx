import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'

import { AppContext, getHeaders } from '../_app'
import { Navigation, TapeAdder, TapeSpinner, tapeColors } from '../../components'
import { Song } from '../../types'
import { BASE_URL, MAX_LINE_LENGTH, SITE_TITLE } from '../../utils/constants'
import { getSongEmbed, validateUuid } from '../../utils/helpers'

const pageTitle = `${SITE_TITLE} :: TapeSpinner Animated React SVG Component Demo`

export default function SongsByUuid() {
  const [canAdd, setCanAdd] = useState(false)
  const { password, uuid } = useContext(AppContext)
  const [songs, setSongs] = useState<Song[]>([])
  const [pageUuid, setPageUuid] = useState('')
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  // wait until router is ready and client uuid is set to fetch songs
  useEffect(() => {
    if (router.isReady && router.query.uuid && uuid) {
      const decodedUuid = validateUuid(decodeURI(router.query.uuid.toString()))

      if (decodedUuid) {
        setPageUuid(decodedUuid)
        setCanAdd(decodedUuid === uuid)
        getSongs(decodedUuid)
      }
    }
  }, [router, password, uuid]) // eslint-disable-line react-hooks/exhaustive-deps

  // fetch songs by uuid
  const getSongs = async (targetUuid: string) => {
    try {
      setLoading(true)

      const safeUrl = `/api/songs/${validateUuid(targetUuid)}`
      const songRes = await fetch(safeUrl, {
        headers: getHeaders({ uuid, password }),
        method: 'GET',
      }).then(res => res.json())

      if (songRes?.data) {
        songRes.data.map((song: Song) => {
          if (typeof tapeColors !== 'undefined' && tapeColors.length && !song.style)
            song.style = { backgroundColor: tapeColors[Math.floor(Math.random() * tapeColors.length)] }
        })

        setSongs(songRes.data)
      } else {
        console.error(songRes)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <link rel="canonical" href={`${BASE_URL}/songs/${pageUuid}`} />
        <title>{pageTitle}</title>
        <meta name="og:title" content={pageTitle} />
        <meta name="description" content="TapeSpinner animated SVG React component demo." />
        <meta property="og:description" content="RyLaB: TapeSpinner animated SVG React component demo." />
      </Head>
      <main>
        <Navigation path={`songs/${pageUuid}`} />
        {!loading && songs?.map((song: Song) => {
          const hasLongArtist = song.artist.length > MAX_LINE_LENGTH
          const hasLongTitle = song.title.length > MAX_LINE_LENGTH

          return (
            <TapeSpinner style={song.style} spin={song.spin} key={song._id} id={`#${song._id}`}>
              <div title={song.title} onClick={() => getSongEmbed(song._id)} className={`titleLine${hasLongTitle ? ' long' : ''}`}>
                {song.title}</div>
              <div title={song.artist} onClick={() => getSongEmbed(song._id)} className={`artistLine${hasLongArtist ? ' long' : ''}`}>
                {song.artist}</div>
              <div className="disabled uuidLine">{song.uuid}</div>
              <div className="songIdLine" onClick={() => getSongEmbed(song._id)}>{song._id}</div>
            </TapeSpinner>
          )
        })}
        {canAdd && <TapeAdder />}
      </main>
    </>
  )
}
