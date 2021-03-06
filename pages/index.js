import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'

const links = [{
  alias: 'facebook',
  name: 'Facebook',
  title: 'Fantastically Friendly Rylab',
  url: 'https://facebook.com/rylab',
},{
  alias: 'github',
  name: 'GitHub',
  title: 'Open Source Rylab',
  url: 'https://github.com/rylab',
},{
  alias: 'instagram',
  name: 'Instagram',
  title: 'Photographically Social Rylab',
  url: 'https://www.instagram.com/rylab',
},{
  alias: 'linkedin',
  name: 'LinkedIn',
  title: 'Super Pro Rylab',
  url: 'http://lnkd.in/bkDM4Bc',
},{
  alias: 'medium-profile',
  name: 'Medium',
  title: 'Poetic Author @rylab',
  url: 'https://rylab.medium.com/',
},{
  alias: 'stackoverflow',
  name: 'StackOverflow',
  title: 'Pragmatic Programmer @rylab',
  url: 'https://stackoverflow.com/users/1035173/ryan-lab',
},{
  alias: 'twitter',
  name: 'Twitter',
  title: 'Tweeting @rylab',
  url: 'https://twitter.com/rylab',
}];

export default function Index() {
  return (
    <Layout index>
      <Head>
        <link rel="canonical" href="https://rylab.com" />
        <title>{ siteTitle } :: Home</title>
        <meta name="og:title" content={`${siteTitle} :: Home`} />
        <meta name="description" content="Welcome to Rylab, digital home of Ryan LaBarre" />
        <meta property="og:description" content="Digital Home of Ryan LaBarre" />
      </Head>
      <div id="header" className="hoverdots">
        <img className="rylab"
          src="/img/rylab_extrovert.png"
          alt="A very pretty building in San Francisco. &copy; Ryan D LaBarre"
          title="Pretty building in San Francisco. Rylab does not live here (but has been here)" />
      </div>
      <div id="rylab">(: hello rylab :)</div>
      <div id="content">
        <p id="haiku-today" className="large light">
          someday&nbsp;I will&nbsp;make;
          a&nbsp;cool personal&nbsp;website;
          it&nbsp;may be&nbsp;today
        </p>
        <p id="haiku-tomorrow" className="small dark hoverlight">
          perhaps tomorrow;
          but&nbsp;probably not&nbsp;either;
          our&nbsp;planet still&nbsp;spins
        </p>
        <div id="digitalhaiku">
          <a href="https://medium.com/@rylab/abc-digitally-evolving-futurist-goals-9b11bd0f54d2"
            rel="noopener" target="_medium" title="Haiku on Medium">
            #digitalhaiku
          </a>
        </div>
        <div id="demos">
          <a href="/demos/tapespinner" target="_demos" title="Tape Spinner demo">
            SVG Cassette Tape Spinner
          </a>
        </div>
        <div id="saxylab">
          <a href="https://saxylab.com" title="Saxy and Ryan Wedding :: SaxyLab">
            Saxy and Ryan are gettin' married!
          </a>
        </div>
        <br />
        {links.length && (
          <>
            <h1>Digital Selves</h1>
            <ul className="narrow list">
              {links.map(link => (
                <li className={`link ${link.alias}`} key={link.alias}>
                  <a title={link.title} href={link.url} rel="noopener" target="_blank">
                    {link.name}</a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <a id="aeq" href="https://algorithmeq.com" target="_aeq">
        <img className="bsd" src="/img/bsd_extrovert.png" alt="// MacOS <== ++BSD;" /></a>
    </Layout>
  )
}
