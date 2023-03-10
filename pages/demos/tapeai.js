import Head from 'next/head'
import { Fragment, useContext, useState } from 'react'

import { AppContext, getHeaders } from '../_app'
import { baseUrl, siteTitle, tapeColors } from '../../components/Layout'
import { TapeSpinner, LoadingSpinner, Navigation } from '../../components'
import { MAX_LINE_LENGTH } from '../../utils/constants'
import { getSongEmbed, getUserEmbed } from '../../utils/helpers'

import styles from '../../styles/ai.module.css'

const pageTitle = `${siteTitle} :: Animated AI Cassette Playground`

export default function TapeAiDemo() {
  const { password, uuid } = useContext(AppContext)
  const [adjectivesInput, setAdjectivesInput] = useState('')
  const [genreInput, setGenreInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [tapes, setTapes] = useState([])

  async function onSubmit(event) {
    event.preventDefault()

    let tapesInfo = []
    setLoading(true)

    try {
      const response = await fetch(`/api/tapeai?adjectives=${adjectivesInput}&genre=${genreInput}`, {
        headers: getHeaders({ uuid, password }),
        method: 'GET',
      })
      
      const responseJson = await response.json()
      tapesInfo = JSON.parse(responseJson) ?? []

      if (response.status >= 400) {
        let message = tapesInfo.error?.message ?? 'GET request failed'

        setLoading(false)

        throw new Error(`${message} [status: ${response.status}]`)
      }

      tapesInfo.map(tape => {
        tape.style = { backgroundColor: tapeColors[Math.floor(Math.random() * tapeColors.length)] }
      })

      tapes.unshift(...tapesInfo)
      setTapes(tapes)
      setLoading(false)
    } catch(error) {
      console.error(error)

      setLoading(false)

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
        <h1 style={{ marginBottom: 0, marginTop: 25 }}>AI Cassette Tape&nbsp;Generator</h1>
        <div className="light" style={{ padding: 30 }}>Uses OpenAI completion with this prompt:<br />
        <br /><i>Create 3 unique music artist names in the &quot;Genre&quot; genre, and their
          &quot;Adjectives&quot; style distinct album&nbsp;titles.</i></div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="genre"
            maxLength={45}
            placeholder="Genre"
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
          />
          <input
            type="text"
            name="adjectives"
            maxLength={45}
            placeholder="Adjectives"
            value={adjectivesInput}
            onChange={(e) => setAdjectivesInput(e.target.value)}
          />
          <input type="submit" value={`Generate ${tapes.length ? 'More ' : ''}Cassettes`} disabled={ loading || !genreInput || !adjectivesInput } />
        </form>
        <div className={styles.result}>
          { loading &&
            <div className="small dark">
              <LoadingSpinner />
              <div style={{ marginTop: -15, marginBottom: 30 }}>
                Generating...
              </div>
          </div> }
          { tapes && tapes.map((tape, index) => {
              const hasLongArtist = tape.artist.length > MAX_LINE_LENGTH
              const hasLongTitle = tape.title.length > MAX_LINE_LENGTH

              return (
                <Fragment key={index}>
                  <TapeSpinner style={ tape.style }>
                    <div title={ tape.title } className={`titleLine${hasLongTitle ? ' long' : ''}`}>
                      { tape.title }</div>
                    <div title={ tape.bio ?? tape.artist } className={`artistLine${hasLongArtist ? ' long' : ''}`}>
                      { tape.artist }</div>
                    <div className="uuidLine" onClick={()=> getUserEmbed(tape.uuid)}>{ tape.uuid }</div>
                    <div className="songIdLine" onClick={() => getSongEmbed(tape._id)}>{ tape._id }</div>
                    { !!tape.bio && <div className="artistBio small">{ tape.bio }</div> }
                  </TapeSpinner>
                  { !!tape.bio && <div className="small light mobileBio mobile-only">{ tape.bio }</div> }
                </Fragment>
              )
            })
          }
        </div>
      </main>
    </>
  )
}
