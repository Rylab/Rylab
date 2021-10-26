import Head from 'next/head'
import Link from 'next/link'
import { siteTitle } from '../components/layout'

export default function InternalServerError() {
  return (
    <>
      <Head>
        <title>{siteTitle} :: 500 Internal Server Error</title>
      </Head>
      <div className="content">
        <Link href={'/'}>
          <img
            className="crosshair"
            style={{ marginTop: 100, marginBottom: 50, height: 250, width: 250 }}
            src="/img/bsd_extrovert.png" alt="RyLaB Home" />
        </Link>
        <p style={{ color: '#666', marginBottom: 250 }}>
          <b>&lt;500&gt;</b>&nbsp;Internal Server Error&nbsp;<b>&lt;/500&gt;</b>
        </p>
      </div>
    </>
  )
}
