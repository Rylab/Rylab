import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styled from 'styled-components'
import styles from '../../styles/ai.module.css'

import { baseUrl, jsonContentType, siteTitle } from '../../components/layout'
import Navigation from '../../components/navigation'

const pageTitle = `${siteTitle} :: Animated AI Cassette Playground`

export default function AiPlayground() {
  const [adjectiveInput, setAdjectiveInput] = useState('')
  const [genreInput, setGenreInput] = useState('')
  const [result, setResult] = useState()

  const router = useRouter()

  async function onSubmit(event) {
    event.preventDefault()

    let tapeInfo = {}

    try {
      const response = await fetch('/api/tapeai', {
        headers: {
          accept: jsonContentType,
          'content-type': jsonContentType,
        },
        method: 'POST',
        body: JSON.stringify({
          adjective: adjectiveInput,
          genre: genreInput,
          uuid,
        }),
      })
      
      if (response.status !== 200) {
        console.warn(response)

        if (response?.error) throw response.error
        else throw new Error(`POST request failed [status ${response?.status}]`)
      }

      tapeInfo = await response.json()

      setResult(tapeInfo.result)
      setAdjectiveInput('')
      setGenreInput('')
    } catch(error) {
      console.error(error)

      if (tapeInfo) console.warn(tapeInfo)
      tapeInfo = {}

      alert(error.message ?? 'Unexpected Error (with no message)')
    }
  }

  return (
    <div>
      <Head>
        <title>{ pageTitle }</title>
        <link rel="canonical" href={`https://${baseUrl}/demos/tapeai`} />
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
            placeholder="Enter a genre"
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
          />
          <input
            type="text"
            name="adjective"
            placeholder="Enter an adjective"
            value={adjectiveInput}
            onChange={(e) => setAdjectiveInput(e.target.value)}
          />
          <input type="submit" value="Generate Cassette" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  )
}
