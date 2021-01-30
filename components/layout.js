import Head from 'next/head'
import styles from './layout.module.css'

export const siteTitle = 'RyLaB';

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <Head>
        <meta charsSet="utf-8" />
        <meta http-equiv="content-type" content="text/html;charset=UTF-8" />
        <meta name="author" content='Ryan "Rylab" D. LaBarre' />
        <meta name="language" content="en" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#222" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta property="og:site_name" content="Rylab.com" />
        <meta property="og:title" content="RyLaB" />
        <link rel="icon" type="image/png" href="/img/bsd_introvert.png" />
      </Head>
      <main>{children}</main>
      <div id="footer">
        <p className="small light">
          <a href="mailto:0@rylab.com">1@rylab.com</a>
          &nbsp;&middot;&nbsp;
          <a alt="Content license URL alias for: CC BY-NC-SA 4.0" href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" title="Creative Commons BY-NC-SA 4.0 as of <?php echo date(DATE_W3C); ?>">
            some rights reserved</a>
        </p>
      </div>
    </div>
  )
}
