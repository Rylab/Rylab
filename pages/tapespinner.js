import Head from 'next/head'
import { useEffect, useState } from 'react'
import Layout, { siteTitle } from '../components/layout'
import TapeSpinner from '../components/tapeSpinner'

export default function SpinnerDemo() {
  const [tapes, setTapes] = useState({})

  const addTape = ({ id, title, artist, spin, style }) => {
    tapes[id] = {
      artist,
      title,
      spin,
      style,
    };

    setTapes({
      ...tapes,
    });
  }

  useEffect(() => {
    addTape({
      id: 'fake-uuid-0001',
      title: 'The Best Song',
      artist: 'The Worst Band',
      style: { backgroundColor: 'rgb(238, 231, 200)', display: 'inline-block', marginRight: 50, marginTop: 15 },
    });

    addTape({
      id: 'fake-uuid-0010',
      title: 'The Worst Snog',
      artist: 'The Best Band',
      spin: false,
      style: { backgroundColor: 'rgb(111, 231, 200)', display: 'inline-block', marginRight: 50, marginTop: 15 },
    });

    addTape({
      id: 'fake-uuid-0100',
      title: 'The Worst Snog With The Best Super Long Name',
      artist: 'The Best Band With The Worst Terrible Long Name',
      spin: false,
      style: { backgroundColor: 'rgb(198, 131, 200)', display: 'inline-block', marginRight: 50, marginTop: 15 },
    });

    addTape({
      id: 'fake-uuid-1000',
      title: 'Loser',
      artist: 'Beck',
      style: { backgroundColor: 'rgb(198, 231, 100)', display: 'inline-block', marginRight: 50, marginTop: 15 },
    });
  }, []);

  return (
    <Layout tapespinner>
      <Head>
        <link rel="canonical" href="https://rylab.com/tapespinner" />
        <title>{ siteTitle } :: TapeSpinner Demo</title>
        <meta name="og:title" content={`${siteTitle} :: Home`} />
        <meta name="description" content="TapeSpinner example" />
        <meta property="og:description" content="Digital Home of Ryan LaBarre" />
      </Head>
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
        {Object.keys(tapes).map(tapeKey => (
          <TapeSpinner style={tapes[tapeKey].style} spin={tapes[tapeKey].spin} key={tapeKey}>
            <div className={`titleLine${tapes[tapeKey].title.length > 20 ? ' long' : ''}`}>{ tapes[tapeKey].title }</div>
            <div className={`artistLine${tapes[tapeKey].artist.length > 20 ? ' long' : ''}`}>{ tapes[tapeKey].artist }</div>
        </TapeSpinner>
        ))}
      </main>
    </Layout>
  )
}