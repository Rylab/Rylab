import Document, { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'
import { ServerStyleSheet } from 'styled-components'
import { BASE_DOMAIN } from '../utils/constants'

export default class Rylab extends Document {
  static async getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage
    const sheet = new ServerStyleSheet()

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />)
        })

      const initialProps = await Document.getInitialProps(ctx)

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="content-type" content="text/html;charset=UTF-8" />
          <meta name="author" content="Ryan LaBarre (Rylab)" />
          <meta name="language" content="en" />
          <meta property="og:site_name" content={BASE_DOMAIN} />
          <meta name="robots" content="index, follow" />
          <meta name="theme-color" content="#222" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" type="image/png" href="/img/bsd_introvert.webp" />
          <link rel="preload" href="/img/bsd_extrovert.webp" as="image" />
          <link rel="preload" href="/img/bsd_introvert.webp" as="image" />
          <link rel="preload" href="/img/bsd_cursor.webp" as="image" />
          <link rel="preload" href="/img/bsd_cursor_invert.webp" as="image" />
          {this.props.styles}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
