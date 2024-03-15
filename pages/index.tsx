import Head from 'next/head'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import languages from '../constants/languages'
import { AppContext, getHeaders } from './_app'
import LoadingSpinner from '../components/LoadingSpinner'
import { BASE_URL, SITE_TITLE } from '../utils/constants'

const pageTitle = `${SITE_TITLE} :: Home`

export default function Index() {
  const { password, uuid } = useContext(AppContext)
  const [loading, setLoading] = useState(true)
  const [selves, setSelves] = useState({
    data: [],
  })

  const getSelves = async () => {
    if (!uuid) return

    try {
      setLoading(true)

      const selves = await fetch('/api/selves', {
        headers: getHeaders({ uuid, password }),
        method: 'GET',
      }).then(res => res.json())

      if (selves.data) {
        setSelves({ data: selves.data })
      } else {
        console.error(selves)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSelves()
  }, [password, uuid]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    console.table(languages.map(lang => { return { 'Language': lang } }))
  }, [])

  return (
    <>
      <Head>
        <link rel="canonical" href={BASE_URL} />
        <link rel="preload" href="/img/bsd_extrovert.webp" as="image" fetchPriority="high" type="image/webp" />
        <link rel="preload" href="/img/bsd_introvert.webp" as="image" fetchPriority="high" type="image/webp" />
        <title>{pageTitle}</title>
        <meta name="og:title" content={pageTitle} />
        <meta name="description" content="Welcome to Rylab, digital home of Ryan LaBarre" />
        <meta property="og:description" content="Digital Home of Ryan LaBarre" />
      </Head>
      <main>
        <div className="header hoverborder lockish">
        </div>
        <div className="rylab-copy lockish">(: hello :)</div>
        <div className="content lockish">
          <p className="haiku-today large light hoverdark">
            someday&nbsp;I will&nbsp;make,<br />
            a&nbsp;great personal&nbsp;website;<br />
            it&nbsp;may be&nbsp;today
          </p>
          <p className="haiku-tomorrow small dark hoverlight">
            perhaps tomorrow?<br />
            probably&nbsp;not then&nbsp;either<br />
            our&nbsp;planet still&nbsp;spins<br />
          </p>
          <div className="narrow list">
            <div className="demo">
              <Link href="/jamband" title="Jam band generator | matchmaker">
                Jam Band Generator
              </Link>
            </div>
            <div className="demo">
              <Link href="/demos/tapespinner" title="Tape Spinner demo | playground">
                Tape Spinner demo
              </Link>
            </div>
            <div className="digitalhaiku">
              <a href="https://medium.com/@rylab/abc-digitally-evolving-futurist-goals-9b11bd0f54d2"
                rel="noreferrer" target="_medium" title="My Haiku on Medium">
                #digitalhaiku
              </a>
            </div>
            <div className="saxylab">
              <a href="https://saxylab.com" target="_saxylab" title="Saxy and Ryan :: SaxyLab">
                SaxyLab
              </a>
            </div>
          </div>
          <br />
          <h1 style={{ marginBottom: 20, marginTop: 40 }}>Digital Selves</h1>
          {selves.data?.length ? (
            <ul className="narrow list">
              {selves.data.map(link => (
                <li className={`link ${link.alias}`} key={link.alias}>
                  <a className="link" title={link.title} href={link.url} rel="noreferrer" target="_blank">
                    {link.name}</a>
                </li>
              ))}
            </ul>
          ) : (
            loading ? <LoadingSpinner /> : <span className="dark">[]</span>
          )}
        </div>
        <img className="bsd lockish" src="/img/bsd_extrovert.webp" alt="// MacOS <== ++BSD;" />
      </main>
    </>
  )
}
