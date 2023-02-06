import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { siteTitle } from '../components/layout'
import LoadingSpinner from '../components/LoadingSpinner'

const contentType = 'application/json'

export default function Index() {
  const [loading, setLoading] = useState(true)
  const [selves, setSelves] = useState({})

  useEffect(() => {
    getSelves()
  }, [])

  const getSelves = async () => {
    try {
      setLoading(true)
  
      const res = await fetch('/api/selves', {
        headers: {
          accept: contentType,
          'content-type': contentType,
        },
        method: 'GET',
      })
      const selves = await res.json()
      setLoading(false)
  
      if (selves.data) {
        setSelves({ data: selves.data })
      } else {
        console.error(res)
      }
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  return (
    <>
      <Head>
        <link rel="canonical" href="https://rylab.com" />
        <title>{ siteTitle } :: Home</title>
        <meta name="og:title" content={`${siteTitle} :: Home`} />
        <meta name="description" content="Welcome to Rylab, digital home of Ryan LaBarre" />
        <meta property="og:description" content="Digital Home of Ryan LaBarre" />
      </Head>
      <main>
        <div id="header" className="hoverdots">
          <img className="rylab"
            src="/img/rylab_extrovert.png"
            alt="A very pretty building in San Francisco. &copy; Ryan D LaBarre"
            title="Pretty building in San Francisco. Rylab does not live here (but has been here)" />
        </div>
        <div id="rylab">(: hello :)</div>
        <div id="content">
          <p id="haiku-today" className="large light">
            someday&nbsp;I will&nbsp;make,<br />
            a&nbsp;great personal&nbsp;website;<br />
            it&nbsp;may be&nbsp;today
          </p>
          <p id="haiku-tomorrow" className="small dark hoverlight">
            perhaps tomorrow?<br />
            probably&nbsp;not then&nbsp;either...<br />
            our&nbsp;planet still&nbsp;spins<br />
          </p>
          <LoadingSpinner />
          <div id="digitalhaiku">
            <a href="https://medium.com/@rylab/abc-digitally-evolving-futurist-goals-9b11bd0f54d2"
              rel="noreferrer" target="_medium" title="My Haiku on Medium">
              #digitalhaiku
            </a>
          </div>
          <div id="demos">
            <Link href="/demos/tapespinner" title="Tape Spinner demo">
              SVG Cassette Tape Spinner
            </Link>
          </div>
          <div id="saxylab">
            <a href="https://saxylab.com" target="_saxylab" title="Saxy and Ryan Wedding :: SaxyLab">
              Saxy and Ryan got hitched!
            </a>
          </div>
          <br />
          {selves.data && selves.data.length ? (
            <>
              <h1 style={{ marginBottom: 20 }}>Digital Selves</h1>
              <ul className="narrow list">
                {selves.data.map(link => (
                  <li className={`link ${link.alias}`} key={link.alias}>
                    <a title={link.title} href={link.url} rel="noreferrer" target="_blank">
                      {link.name}</a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <LoadingSpinner />
          )}
        </div>
        <a id="aeq" href="https://algorithmeq.com" target="_aeq">
          <img className="bsd" src="/img/bsd_extrovert.png" alt="// MacOS <== ++BSD;" /></a>
      </main>
    </>
  )
}
