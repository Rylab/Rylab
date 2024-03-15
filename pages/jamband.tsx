import Head from 'next/head'
import { CSSProperties, Fragment, useContext, useState } from 'react'

import { AppContext, getHeaders } from './_app'
import { Layout, LoadingSpinner, Navigation, TapeSpinner, tapeColors } from '../components'
import { BASE_URL, MAX_LINE_LENGTH, SITE_TITLE } from '../utils/constants'
import { getSongEmbed, getUserEmbed } from '../utils/helpers'

import styles from '../styles/ai.module.css'

const MAX_ADJECTIVES_LENGTH = 90
const MAX_GENRE_LENGTH = 45

const pageTitle = `${SITE_TITLE} :: Jam Band Co-Creation Playground`

type TapeInfo = {
  error?: any
  tapes: Array<{
    artist: string
    style?: CSSProperties
    title: string
  }>
}

const Jamband = () => {
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
    } catch (error) {
      console.error(error)
      alert(error.message ?? 'Unexpected Error. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link rel="canonical" href={`${BASE_URL}/jamband`} />
        <link rel="icon" href="/img/bsd_introvert.webp" />
        <meta name="og:title" content={pageTitle} />
        <meta name="description" content="Jam Band AI: create unique new artist names, album titles, and bios from simple prompts. Then make it a reality." />
        <meta property="og:description" content="Jam Band AI: create unique new artist names, album titles, and bios from simple prompts. Then make it a reality." />
      </Head>
      <main className={styles.main}>
        <Navigation path="jamband" />
        <h1 style={{ marginBottom: 0, marginTop: 25 }}>Jam Band Generator</h1>
        <div className="light" style={{ padding: 30 }}>
          <form style={{ marginTop: 20 }} onSubmit={onSubmit}>
            <i>Create 3 unique band personas in the genre&nbsp;&nbsp;
              <input
                tabIndex={1}
                type="text"
                name="genre"
                maxLength={MAX_GENRE_LENGTH}
                placeholder="genre / style"
                style={{ display: 'inline-block', marginTop: 20, marginBottom: 5 }}
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
              />
              &nbsp;&nbsp;and their&nbsp;&nbsp;
              <input
                tabIndex={2}
                type="text"
                name="adjectives"
                maxLength={MAX_ADJECTIVES_LENGTH}
                placeholder="adjectives, etc"
                style={{ display: 'inline-block', marginTop: 20, marginBottom: 20 }}
                value={adjectivesInput}
                onChange={(e) => setAdjectivesInput(e.target.value)}
              />
              &nbsp;&nbsp;album&nbsp;titles.</i>
            <input
              tabIndex={3}
              type="submit"
              style={{ marginTop: 20 }}
              value={`Generate ${tapes.length ? 'More ' : ''}Ideas`}
              disabled={loading || !genreInput || !adjectivesInput} />
          </form>
          <div className="small mt-30">ChatGPT generation used to create and match jam band vibe ideas, trained by your prompts</div>
        </div>
        {(loading || tapes?.length > 0) && (
          <div className={styles.result}>
            {loading &&
              <div className="small dark">
                <LoadingSpinner />
                <div style={{ marginTop: -15, marginBottom: 30 }}>
                  Generating...
                </div>
              </div>}
            {tapes && tapes.map((tape, index) => {
              const hasLongArtist = tape.artist.length > MAX_LINE_LENGTH
              const hasLongTitle = tape.title.length > MAX_LINE_LENGTH

              return (
                <Fragment key={index}>
                  <TapeSpinner style={tape.style}>
                    <div title={tape.title} className={`titleLine${hasLongTitle ? ' long' : ''}`}>
                      {tape.title}</div>
                    <div title={tape.bio ?? tape.artist} className={`artistLine${hasLongArtist ? ' long' : ''}`}>
                      {tape.artist}</div>
                    <div className="uuidLine" onClick={() => getUserEmbed(tape.uuid)}>{tape.uuid}</div>
                    <div className="songIdLine" onClick={() => getSongEmbed(tape._id)}>{tape._id}</div>
                    {!!tape.bio && <div className="artistBio"><span style={{ alignSelf: 'flex-start' }}>{tape.bio}</span></div>}
                  </TapeSpinner>
                  {!!tape.bio && <div className="light mobileBio mobile-only">{tape.bio}</div>}
                </Fragment>
              )
            })
            }
          </div>
        )}
        <div className="light" style={{ marginBottom: 60, marginTop: 60 }}>Add a track; upvote tracks; invite others to add and remix; bring virtual jam bands to life.</div>
      </main>
    </>
  )
}

Jamband.getLayout = page => <Layout useAuth>{page}</Layout>

export default Jamband
