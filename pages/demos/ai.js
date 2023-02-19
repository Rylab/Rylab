import { v4 as uuidv4 } from 'uuid'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import styles from '../../styles/ai.module.css'
import { baseUrl, siteTitle } from '../../components/layout'
import Navigation from '../../components/navigation'

const pageTitle = `${siteTitle} :: Animated AI Cassette Playground`

export default function AiPlayground() {
  const [adjectiveInput, setAdjectiveInput] = useState('')
  const [genreInput, setGenreInput] = useState('')
  const [result, setResult] = useState()
  const [uuid, setUuid] = useState()

  const getUuid = () => {
    if (uuid) return uuid

    const localUuid = localStorage.getItem('uuid')

    if (localUuid) {
      setUuid(localUuid)

      return localUuid
    }

    const newUuid = uuidv4()

    try {
      localStorage.setItem('uuid', newUuid)
      setUuid(newUuid)

      return newUuid
    } catch (e) {
      console.error(e)

      alert('A browser supporting localStorage is required.')
    }
  }

  async function onSubmit(event) {
    event.preventDefault()

    let tapeInfo = {}

    try {

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adjective: adjectiveInput,
          genre: genreInput,
          uuid: getUuid(),
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
        <link rel="canonical" href={`https://${baseUrl}/demos/tapespinner`} />
        <link rel="icon" href="/img/bsd_introvert.png" />
        <meta name="og:title" content={ pageTitle } />
        <meta name="description" content="TapeSpinner: animated AI Cassette Tape playground." />
        <meta property="og:description" content="RyLaB TapeSpinner: animated AI cassette playground." />
      </Head>

      <main className={styles.main}>
        <Navigation path='demos/ai' />
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
