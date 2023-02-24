import Head from 'next/head'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'

import { AppContext, getHeaders } from './_app'
import { baseUrl, siteTitle } from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'

const pageTitle = `${siteTitle} :: Home`

export default function Index() {
  const { password, uuid } = useContext(AppContext)

  const [loading, setLoading] = useState(true)
  const [selves, setSelves] = useState({})

  const getSelves = async () => {
    if (!uuid) return;

    try {
      setLoading(true)

      const res = await fetch('/api/selves', {
        headers: getHeaders({ uuid, password }),
        method: 'GET',
      })
      const selves = await res.json()

      if (selves.data) {
        setSelves({ data: selves.data })
      } else {
        console.error(res)
      }

      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  useEffect(() => {
    getSelves()
  }, [password, uuid]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Head>
        <link rel="canonical" href={baseUrl} />
        <title>{ pageTitle }</title>
        <meta name="og:title" content={ pageTitle } />
        <meta name="description" content="Welcome to Rylab, digital home of Ryan LaBarre" />
        <meta property="og:description" content="Digital Home of Ryan LaBarre" />
      </Head>
      <main>
        <div className="header hoverborder lockish">
          <img className="rylab-image"
            src="/img/rylab_extrovert.png"
            alt="A very pretty building in Golden Gate Park, San Francisco"
            title="A very pretty building in Golden Gate Park." />
        </div>
        <div className="rylab-copy lockish">(: hello :)</div>
        <div className="content lockish">
          <p className="haiku-today large light">
            someday&nbsp;I will&nbsp;make,<br />
            a&nbsp;great personal&nbsp;website;<br />
            it&nbsp;may be&nbsp;today
          </p>
          <p className="haiku-tomorrow small dark hoverlight">
            perhaps tomorrow?<br />
            probably&nbsp;not then&nbsp;either...<br />
            our&nbsp;planet still&nbsp;spins<br />
          </p>
          <LoadingSpinner />
          <div className="demo">
            <Link href="/demos/tapespinner" title="Tape Spinner playground">
              Animated SVG cassettes
            </Link>
          </div>
          <div className="demo">
            <Link href="/demos/tapeai" title="Tape AI playground">
              AI cassette generator
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
          <br />
          { selves.data?.length ? (
            <>
              <h1 style={{ marginBottom: 20 }}>Digital Selves</h1>
              <ul className="narrow list">
                {selves.data.map(link => (
                  <li className={`link ${link.alias}`} key={link.alias}>
                    <a className="link" title={link.title} href={link.url} rel="noreferrer" target="_blank">
                      {link.name}</a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            loading ? <LoadingSpinner /> : (<span className="dark">[]</span>)
          )}
        </div>
        <img className="bsd lockish" src="/img/bsd_extrovert.png" alt="// MacOS <== ++BSD;" />
      </main>
    </>
  )
}
