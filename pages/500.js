import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { BASE_URL, SITE_TITLE } from '../utils/constants'

const pageTitle = `${SITE_TITLE} :: Internal Server Error`

export default function InternalServerError() {
  return (
    <>
      <Head>
        <link rel="canonical" href={`${ BASE_URL }/500`} />
        <title>{ pageTitle }</title>
      </Head>
      <div className="content" style={{ marginTop: 100 }}>
        <Link href={'/'} className="discreet" passHref>
          <Image
            className="crosshair"
            height="300"
            width="300"
            src="/img/bsd_extrovert.png" alt="RyLaB Home" />
        </Link>
        <p style={{ color: '#666', marginBottom: 250, marginTop: 20 }}>
          <b>&lt;500&gt;</b>&nbsp;Internal Server Error&nbsp;<b>&lt;/500&gt;</b>
        </p>
      </div>
    </>
  )
}
