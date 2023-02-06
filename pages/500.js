import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { siteTitle } from '../components/layout'

export default function InternalServerError() {
  return (
    <>
      <Head>
        <title>{siteTitle} :: 500 Internal Server Error</title>
      </Head>
      <div className="content" style={{ marginTop: 100 }}>
        <Link href={'/'} passHref>
          <Image
            className="crosshair"
            height="250"
            width="250"
            src="/img/bsd_extrovert.png" alt="RyLaB Home" />
        </Link>
        <p style={{ color: '#666', marginBottom: 250, marginTop: 20 }}>
          <b>&lt;500&gt;</b>&nbsp;Internal Server Error&nbsp;<b>&lt;/500&gt;</b>
        </p>
      </div>
    </>
  )
}
