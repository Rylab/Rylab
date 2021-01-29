import Head from 'next/head'
import styles from './layout.module.css'
import Link from 'next/link'

const name = 'Rylab'
export const siteTitle = 'RyLaB'

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Rylab.js"
        />
        <meta name="og:title" content={siteTitle} />
      </Head>
      <main>{children}</main>
    </div>
  )
}
