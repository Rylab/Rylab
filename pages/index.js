import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { baseUrl, jsonContentType, siteTitle } from '../components/layout'
import LoadingSpinner from '../components/LoadingSpinner'

const pageTitle = `${siteTitle} :: Home`

export default function Index() {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState({})
  const [selves, setSelves] = useState({})

  useEffect(() => {
    setPassword(localStorage.getItem('managePass'))
    getSelves()
  }, [])

  const getSelves = async () => {
    try {
      setLoading(true)
  
      const headers = {
        accept: jsonContentType,
        'content-type': jsonContentType,
        method: 'GET',
      };

      if (password) {
        headers['x-admin'] = password
      }

      const res = await fetch('/api/selves', {
        headers,
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

  // TODO update for song
  const toggleEditing = e => {
    setEditing({
      data: [
        ...guestList.data,
      ],
      editing: {
        ...guestList.editing,
        [e.target.name]: !guestList.editing[e.target.name],
      },
    })
  }

  return (
    <>
      <Head>
        <link rel="canonical" href={`https://${ baseUrl }`} />
        <title>{ pageTitle }</title>
        <meta name="og:title" content={ pageTitle } />
        <meta name="description" content="Welcome to Rylab, digital home of Ryan LaBarre" />
        <meta property="og:description" content="Digital Home of Ryan LaBarre" />
      </Head>
      <main>
        <div id="header" className="hoverborder lockish">
          <img className="rylab"
            src="/img/rylab_extrovert.png"
            alt="A very pretty building in Golden Gate Park, San Francisco"
            title="A very pretty building in Golden Gate Park." />
        </div>
        <div id="rylab" className="lockish">(: hello :)</div>
        <div id="content" className="lockish">
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
          <div className="demo">
            <Link href="/demos/tapespinner" title="Tape Spinner demo">
              Animated SVG Cassette spinner
            </Link>
          </div>
          <div className="demo">
            <Link href="/demos/tapeai" title="Tape Spinner demo">
              OpenAI Cassette generator
            </Link>
          </div>
          <div id="digitalhaiku">
            <a href="https://medium.com/@rylab/abc-digitally-evolving-futurist-goals-9b11bd0f54d2"
              rel="noreferrer" target="_medium" title="My Haiku on Medium">
              #digitalhaiku
            </a>
          </div>
          <div id="saxylab">
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
            <LoadingSpinner />
          )}
        </div>
        <img className="bsd lockish" src="/img/bsd_extrovert.png" alt="// MacOS <== ++BSD;" />
      </main>
    </>
  )
}
