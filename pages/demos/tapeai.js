import Head from 'next/head'
import { Fragment, useContext, useState } from 'react'

import { AppContext, getHeaders } from '../_app'
import { baseUrl, siteTitle, tapeColors } from '../../components/Layout'
import { TapeSpinner, LoadingSpinner, Navigation } from '../../components'
import { getSongEmbed, getUserEmbed } from '../../utils/helpers'

import styles from '../../styles/ai.module.css'

const pageTitle = `${siteTitle} :: Animated AI Cassette Playground`

export default function TapeAiDemo() {
  const { password, uuid } = useContext(AppContext)
  const [adjectivesInput, setAdjectivesInput] = useState('')
  const [dots, setDots] = useState('.')
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
        <h1 style={{ marginBottom: 0, marginTop: 25 }}>AI Cassette Tape&nbsp;Generator</h1>
        <div className="light" style={{ padding: 30 }}>Uses OpenAI with this simple prompt:<br />
        <br /><i>Come up with 3 unique names for music artists in the &quot;genre&quot; genre and their &quot;adjectives&quot; style album&nbsp;titles.</i></div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="genre"
            placeholder="Set &quot;genre&quot;"
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
          />
          <input
            type="text"
            name="adjectives"
            placeholder="Set &quot;adjectives&quot;"
            value={adjectivesInput}
            onChange={(e) => setAdjectivesInput(e.target.value)}
          />
          <input type="submit" value={`Generate ${tapes.length ? 'More ' : ''}Cassettes`} disabled={ loading || !genreInput || !adjectivesInput } />
        </form>
        <div className={styles.result}>
          { loading &&
            <div className="small dark">
              <LoadingSpinner />
              <div style={{ marginTop: -15 }}>
                Generating...
              </div>
          </div> }
          { tapes && tapes.map((tape, index) => {
              const hasLongArtist = tape.artist.length > 25
              const hasLongTitle = tape.title.length > 25

              return (
                <Fragment key={index}>
                  <TapeSpinner style={ tape.style }>
                    <div title={ tape.title } className={`titleLine${hasLongTitle ? ' long' : ''}`}>
                      { tape.title }</div>
                    <div title={ tape.biography } className={`artistLine${hasLongArtist ? ' long' : ''}`}>
                      { tape.artist }</div>
                    <div className="uuidLine" onClick={()=> getUserEmbed(tape.uuid)}>{ tape.uuid }</div>
                    <div className="songIdLine" onClick={() => getSongEmbed(tape._id)}>{ tape._id }</div>
                  </TapeSpinner>
                  <div className="small light mobile-only" style={{ paddingLeft: 30, paddingRight: 30, marginTop: -10, marginBottom: 10 }}>{ tape.biography }</div>
                </Fragment>
              )
            })
          }
        </div>
      </main>
    </>
  )
}
