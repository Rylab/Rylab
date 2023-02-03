import Head from 'next/head'
import Link from 'next/link'
import { siteTitle } from '../components/layout'

export default function NotFound() {
  return (
    <>
      <Head>
        <title>{siteTitle} :: 404 Page Not Found</title>
      </Head>
      <div className="content">
        <Link href={'/'} passHref>
          <img
            className="crosshair"
            style={{ marginTop: 100, marginBottom: 50, height: 250, width: 250 }}
            src="/img/bsd_extrovert.png" alt="RyLaB Home" />
        </Link>
        <p style={{ color: '#666', marginBottom: 250 }}>
          <b>&lt;404&gt;</b>&nbsp;Not Found&nbsp;<b>&lt;/404&gt;</b>
        </p>
      </div>
    </>
  )
}
