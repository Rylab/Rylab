import Head from 'next/head'
import { CSSProperties, Fragment, useContext, useState } from 'react'

import { AppContext, getHeaders } from '../_app'
import { tapeColors } from '../../components/Layout'
import { TapeSpinner, LoadingSpinner, Navigation } from '../../components'
import { BASE_URL, SITE_TITLE, MAX_LINE_LENGTH } from '../../utils/constants'
import { getSongEmbed, getUserEmbed } from '../../utils/helpers'

import styles from '../../styles/ai.module.css'

const MAX_ADJECTIVES_LENGTH = 90
const MAX_GENRE_LENGTH = 45

const pageTitle = `${SITE_TITLE} :: AI Music Artist Creation Playground`

type TapeInfo = {
  error?: any
  tapes: Array<{
    artist: string
    style?: CSSProperties
    title: string
  }>
}

export default function TapeAiDemo() {
  const { password, uuid } = useContext(AppContext)
  const [adjectivesInput, setAdjectivesInput] = useState('')
  const [genreInput, setGenreInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [tapes, setTapes] = useState([])

  async function onSubmit(event) {
    event.preventDefault()

    let info: TapeInfo = { tapes: [] }

    setLoading(true)

    try {
      const response = await fetch(`/api/tapeai?adjectives=${adjectivesInput}&genre=${genreInput}`, {
        headers: getHeaders({ uuid, password }),
        method: 'GET',
      })
      
      const responseJson = await response.json()
      info.tapes = JSON.parse(responseJson) ?? []

      if (response.status >= 400) {
        let message = info.error?.message ?? 'GET request failed'

        setLoading(false)

        throw new Error(`${message} [status: ${response.status}]`)
      }

      info.tapes.map(tape => {
        tape.style = { backgroundColor: tapeColors[Math.floor(Math.random() * tapeColors.length)] }
      })

      tapes.unshift(...info.tapes)
      setTapes(tapes)
    } catch(error) {
      console.error(error)
      alert(error.message ?? 'Unexpected Error. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>{ pageTitle }</title>
        <link rel="canonical" href={`${BASE_URL}/demos/tapeai`} />
        <link rel="icon" href="/img/bsd_introvert.png" />
        <meta name="og:title" content={ pageTitle } />
        <meta name="description" content="Tape AI: trained to create unique new artist names, album titles, and bios from simple prompts." />
        <meta property="og:description" content="Tape AI: ChatGPT playground, trained to create unique new artist names, album titles, and bios from simple prompts." />
      </Head>
      <main className={styles.main}>
        <Navigation path='demos/tapeai' />
        <h1 style={{ marginBottom: 0, marginTop: 25 }}>Tape AI &mdash; Music Cassette&nbsp;Generator</h1>
        <div className="light" style={{ padding: 30 }}>
          ChatGPT completion trained for this simple&nbsp;additional&nbsp;prompt:
          <form style={{ marginTop: 20 }} onSubmit={onSubmit}>
            <i>Create 3 unique music artists in the genre&nbsp;&nbsp;
              <input
                type="text"
                name="genre"
                maxLength={MAX_GENRE_LENGTH}
                placeholder="genre / style name here"
                style={{ display: 'inline-block', marginTop: 20, marginBottom: 5 }}
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
              />
              &nbsp;&nbsp;and their&nbsp;&nbsp;
              <input
                type="text"
                name="adjectives"
                maxLength={MAX_ADJECTIVES_LENGTH}
                placeholder="adjectives, or whatever, go here"
                style={{ display: 'inline-block', marginTop: 20, marginBottom: 20 }}
                value={adjectivesInput}
                onChange={(e) => setAdjectivesInput(e.target.value)}
              />
              &nbsp;&nbsp;album&nbsp;titles.</i>
            <input
              type="submit"
              style={{ marginTop: 20 }}
              value={`Generate ${tapes.length ? 'More ' : ''}Cassettes`}
              disabled={ loading || !genreInput || !adjectivesInput } />
          </form>
        </div>

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
                    { !!tape.bio && <div className="artistBio small"><span style={{ alignSelf: 'flex-start' }}>{ tape.bio }</span></div> }
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
