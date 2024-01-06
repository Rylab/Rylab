import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '../components/Layout'
import { BASE_URL, SITE_TITLE } from '../utils/constants'

const pageTitle = `${SITE_TITLE} :: Not Found`

const NotFound = (): JSX.Element => {
  return (
    <>
      <Head>
        <link rel="canonical" href={`${BASE_URL}/404`} />
        <title>{pageTitle}</title>
      </Head>
      <div className="content" style={{ marginTop: 100 }}>
        <Link href={'/'} className="discreet" passHref>
          <Image
            className="crosshair"
            height="300"
            width="300"
            src="/img/bsd_extrovert.webp" alt="RyLaB Home" />
        </Link>
        <p style={{ color: '#666', marginBottom: 250, marginTop: 20 }}>
          <b>&lt;404&gt;</b>&nbsp;Not Found&nbsp;<b>&lt;/404&gt;</b>
        </p>
      </div>
    </>
  )
}

NotFound.getLayout = page => <Layout hideAdminInput>{page}</Layout>

export default NotFound
