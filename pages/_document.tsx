import Document, { Html, Head, Main, NextScript } from 'next/document'
import { BASE_DOMAIN } from '../utils/constants'

export default class Rylab extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="content-type" content="text/html;charset=UTF-8" />
          <meta name="author" content="Ryan LaBarre (Rylab)" />
          <meta name="language" content="en" />
          <meta name="robots" content="index,follow" />
          <meta name="theme-color" content="#222" />
          <meta property="og:site_name" content={BASE_DOMAIN} />
          <link rel="icon" type="image/png" href="/img/bsd_introvert.webp" />
          <link rel="preload" href="/img/bsd_cursor.webp" as="image" type="image/webp" />
          <link rel="preload" href="/img/bsd_cursor_invert.webp" as="image" type="image/webp" />
          <link rel="preload" href="/img/bsd_extrovert.webp" as="image" type="image/webp" />
          <link rel="preload" href="/img/bsd_introvert.webp" as="image" type="image/webp" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
