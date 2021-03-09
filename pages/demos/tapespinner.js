import Head from 'next/head'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Layout, { siteTitle } from '../../components/layout'
import TapeSpinner from '../../components/cassetteTapeSpinner'

const AddButton = styled.button`
  border-radius: 20px;
  font-size: 14pt;
  padding: 8px 20px;
`

export default function SpinnerDemo() {
  const [showAdd, setShowAdd] = useState(false)
  const [song, setSong] = useState({})
  const [addedSongCount, setAddedSongCount] = useState(0)
  const [tapes, setTapes] = useState({})

  const addSong = () => {
    if (song.title && song.artist) {
      if (!song.id) {
        song.id = `rando-${addedSongCount}`;
      }

      addTape({
        ...song,
        style: { backgroundColor: '#777' },
      });
      setAddedSongCount(addedSongCount + 1)
      setSong({});
    } else {
      console.error('Song title and artist are required.');
    }
  }

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

  const handleSongChange = e => {
    const { name, value } = e.target

    setSong({
      ...song,
      [name]: value,
    })
  }

  useEffect(() => {
    addTape({
      id: 'fake-uuid-0001',
      title: 'The Best Song',
      artist: 'The Worst Band',
      style: { backgroundColor: 'rgb(238, 231, 200)' },
    });

    addTape({
      id: 'fake-uuid-0010',
      title: 'The Worst Snog',
      artist: 'The Best Band',
      spin: false,
      style: { backgroundColor: 'rgb(111, 231, 200)' },
    });

    addTape({
      id: 'fake-uuid-0100',
      title: 'The Worst Snog With The Best Super Long Name',
      artist: 'The Best Band With The Worst Terrible Long Name',
      spin: false,
      style: { backgroundColor: 'rgb(198, 131, 200)' },
    });

    addTape({
      id: 'fake-uuid-1000',
      title: 'Loser',
      artist: 'Beck',
      style: { backgroundColor: 'rgb(198, 231, 100)' },
    });

    setShowAdd(true);
  }, []);

  return (
    <Layout tapespinner>
      <Head>
        <link rel="canonical" href="https://rylab.com/tapespinner" />
        <title>{ siteTitle } :: TapeSpinner Demo</title>
        <meta name="og:title" content={`${siteTitle} :: TapeSpinner Demo`} />
        <meta name="description" content="TapeSpinner component demo." />
        <meta property="og:description" content="RyLaB: TapeSpinner component demo." />
      </Head>
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
        {Object.keys(tapes).map(tapeKey => (
          <TapeSpinner style={tapes[tapeKey].style} spin={tapes[tapeKey].spin} key={tapeKey}>
            <div className={`titleLine${tapes[tapeKey].title.length > 20 ? ' long' : ''}`}>{ tapes[tapeKey].title }</div>
            <div className={`artistLine${tapes[tapeKey].artist.length > 20 ? ' long' : ''}`}>{ tapes[tapeKey].artist }</div>
        </TapeSpinner>
        ))}

        {showAdd && (
        <div style={{ marginTop: 50 }}>
          <h3>Add a song to the playlist:</h3>
          <TapeSpinner spin={false} style={{backgroundColor: '#888', display: 'block', margin: '10px auto'}}>
            <input
              name="title"
              className="titleInput"
              maxLength="38"
              placeholder="Song title"
              value={song.title || ''}
              onChange={handleSongChange} />
            <input
              name="artist"
              className="artistInput"
              maxLength="36"
              placeholder="Artist"
              value={song.artist || ''}
              onChange={handleSongChange} />
          </TapeSpinner>

          <AddButton
            disabled={!song.title && !song.artist}
            onClick={addSong}>
              Add Song</AddButton>
        </div>
        )}
      </main>
    </Layout>
  )
}