import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'

export default function Index() {
  return (
    <Layout index>
      <Head>
        <title>{ siteTitle }</title>
      </Head>
      <section>
      </section>
    </Layout>
  )
}
