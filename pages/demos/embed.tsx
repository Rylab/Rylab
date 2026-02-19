import Head from 'next/head'
import { BASE_URL, SITE_TITLE } from '../../utils/constants'
import styles from './embed.module.css'

const pageTitle = `${SITE_TITLE} :: TapeSpinner Animated React Component Embedding Demo`

export default function EmbedDemo() {
  const sampleSongId = '6044ea5f5e3419796909ddf0'

  return (
    <>
      <Head>
        <link rel="canonical" href={`${BASE_URL}/demos/embed`} />
        <title>{pageTitle}</title>
        <meta name="og:title" content={pageTitle} />
        <meta name="description" content="TapeSpinner animated SVG React component iframe embedding demo." />
        <meta property="og:description" content="RyLaB: TapeSpinner animated SVG React component embedding example." />
      </Head>
      <main className="embedding hideFooter" style={{ marginTop: 50 }}>
        <iframe className={styles.tapeEmbed} src={`${BASE_URL}/song/${sampleSongId}?embed=true`} />
      </main>
    </>
  )
}
