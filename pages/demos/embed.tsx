import Head from 'next/head'
import styled from 'styled-components'
import { baseUrl, siteTitle } from '../../components/Layout'

const pageTitle = `${siteTitle} :: TapeSpinner Animated React Component Embedding Demo`

const TapeEmbed = styled.iframe`
  min-height: 400px;
  min-width: 400px;

  @media (min-width: 569px) {
    min-height: 480px;
    min-width: 500px;
  }
`

export default function EmbedDemo() {
  const sampleSongId = '6044ea5f5e3419796909ddf0'

  return (
    <>
      <Head>
        <link rel="canonical" href={`${baseUrl}/demos/embed`} />
        <title>{ pageTitle }</title>
        <meta name="og:title" content={ pageTitle } />
        <meta name="description" content="TapeSpinner animated SVG React component iframe embedding demo." />
        <meta property="og:description" content="RyLaB: TapeSpinner animated SVG React component embedding example." />
      </Head>
      <main className="embedding hideFooter" style={{ marginTop: 50 }}>
        <TapeEmbed className="tapeEmbed" src={`${baseUrl}/song/${sampleSongId}?embed=true`} />
      </main>
    </>
  )
}
