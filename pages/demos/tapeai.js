import Head from 'next/head'
import { useContext, useState } from 'react'

import { AppContext, getHeaders, jsonType } from '../_app'
import { baseUrl, siteTitle, tapeColors } from '../../components/Layout'
import { TapeSpinner, LoadingSpinner, Navigation } from '../../components'
import { getSongEmbed, getUserEmbed } from '../../utils/helpers'

import styles from '../../styles/ai.module.css'

const pageTitle = `${siteTitle} :: Animated AI Cassette Playground`

export default function TapeAiDemo() {
  const { password, uuid } = useContext(AppContext)
  const [adjectiveInput, setAdjectiveInput] = useState('')
  const [genreInput, setGenreInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [tapes, setTapes] = useState([])

  async function onSubmit(event) {
    event.preventDefault()

    let tapesInfo = []
    setLoading(true)

    try {
      const response = await fetch(`/api/tapeai?adjective=${adjectiveInput}&genre=${genreInput}`, {
        headers: getHeaders({ uuid, password }),
        method: 'GET',
      })
      
      if (response.status !== 200) {
        console.warn(response)
        
        if (response?.error) throw response.error
        else throw new Error(`GET request failed [status ${response?.status}]`)
      }

      tapesInfo = await response.json() ?? []

      tapesInfo.map(tape => {
        tape.style = { backgroundColor: tapeColors[Math.floor(Math.random() * tapeColors.length)] }
      })

      tapes.unshift(...tapesInfo)
      setTapes(tapes)
      setLoading(false)
    } catch(error) {
      console.error(error)

      setLoading(false)

      if (tapesInfo) console.warn(tapesInfo)

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
          { loading && <div><LoadingSpinner /></div> }
          { tapes && tapes.map((song, index) => {
              const hasLongArtist = song.artist.length > 25
              const hasLongTitle = song.title.length > 25

              return (
                <TapeSpinner key={index} style={ song.style }>
                  <div title={ song.title } onClick={() => getSongEmbed(song._id)} className={`titleLine${hasLongTitle ? ' long' : ''}`}>
                    { song.title }</div>
                  <div title={ song.artist } onClick={() => getSongEmbed(song._id)} className={`artistLine${hasLongArtist ? ' long' : ''}`}>
                    { song.artist }</div>
                  <div className="uuidLine" onClick={()=> getUserEmbed(song.uuid)}>{ song.uuid }</div>
                  <div className="songIdLine" onClick={() => getSongEmbed(song._id)}>{ song._id }</div>
                </TapeSpinner>
              )
            })
          }
        </div>
      </main>
    </>
  )
}
