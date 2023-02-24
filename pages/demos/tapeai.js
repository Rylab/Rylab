import Head from 'next/head'
import Link from 'next/link'
import { useContext, useState } from 'react'

import { AppContext, getHeaders, jsonType } from '../_app'
import { baseUrl, siteTitle, tapeColors } from '../../components/Layout'

import TapeSpinner from '../../components/TapeSpinner'
import LoadingSpinner from '../../components/LoadingSpinner'
import Navigation from '../../components/Navigation'

import styles from '../../styles/ai.module.css'

const pageTitle = `${siteTitle} :: Animated AI Cassette Playground`

export default function TapeAiDemo() {
  const { password, uuid } = useContext(AppContext)
  const [adjectiveInput, setAdjectiveInput] = useState('')
  const [genreInput, setGenreInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])

  const getEmbed = _id => {
    window.open(`/song/${_id}`, 'rylab', 'menubar=1,resizable=1,width=400,height=450');
  }

  async function onSubmit(event) {
    event.preventDefault()

    let tapeInfo = {}
    setLoading(true)

    try {
      const response = await fetch(`/api/tapeai?adjective=${adjectiveInput}&genre=${genreInput}`, {
        headers: getHeaders({ uuid, password }),
        method: 'GET',
      })

      tapeInfo = await response.json()

      if (response.status !== 200) {
        console.warn(response)

        if (response?.error) throw response.error
        else throw new Error(`GET request failed [status ${response?.status}]`)
      }

      const completions = []
      const artistResults = tapeInfo.artist.split(',')
      const titleResults = tapeInfo.title.split(',')

      artistResults.forEach((artist, index) => {
        completions.push({
          artist,
          style: { backgroundColor: tapeColors[Math.floor(Math.random() * tapeColors.length)] },
          title: titleResults[index] || '',
        })
      })

      setResults(completions)
      setLoading(false)
    } catch(error) {
      console.error(error)

      setLoading(false)

      if (tapeInfo) console.warn(tapeInfo)
      setResults([])

      alert(error.message ?? 'Unexpected Error (with no message)')
    }
  }

  return (
    <>
      <Head>
        <title>{ pageTitle }</title>
        <link rel="canonical" href={`${baseUrl}/demos/tapeai`} />
        <link rel="icon" href="/img/bsd_introvert.png" />
        <meta name="og:title" content={ pageTitle } />
        <meta name="description" content="TapeSpinner: animated AI Cassette Tape playground." />
        <meta property="og:description" content="RyLaB TapeSpinner: animated AI cassette playground." />
      </Head>

      <main className={styles.main}>
        <Navigation path='demos/tapeai' />
        <h1 style={{ marginBottom: 30, marginTop: 25 }}>AI Cassette Tape Generator</h1>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="genre"
            placeholder="Set genre or musical type"
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
          />
          <input
            type="text"
            name="adjective"
            placeholder="Add at least one adjective for flavor"
            value={adjectiveInput}
            onChange={(e) => setAdjectiveInput(e.target.value)}
          />
          <input type="submit" value="Generate Cassettes" disabled={ loading || !genreInput || !adjectiveInput } />
        </form>
        <div className={styles.result}>
          { results.length && !loading ? (
            results.map((song, index) => {
              const hasLongArtist = song.artist.length > 25
              const hasLongTitle = song.title.length > 25

              return (
                <TapeSpinner key={index} style={ song.style }>
                  <div title={ song.title } onClick={() => getEmbed(song._id)} className={`titleLine${hasLongTitle ? ' long' : ''}`}>
                    { song.title }</div>
                  <div title={ song.artist } onClick={() => getEmbed(song._id)} className={`artistLine${hasLongArtist ? ' long' : ''}`}>
                    { song.artist }</div>
                  <div className="songIdLine" onClick={() => getEmbed(song._id)}>{ song._id }</div>
                  <div className="uuidLine"><Link href={`/songs/${song.uuid}`}>{ song.uuid }</Link></div>
                </TapeSpinner>
              )
            })
          ) : (loading ? <LoadingSpinner /> : '' ) }
        </div>
      </main>
    </>
  )
}
