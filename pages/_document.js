import Document, { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'
import { ServerStyleSheet } from 'styled-components'
import { baseDomain } from '../components/Layout'

export default class Rylab extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

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
      };
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
          <meta name="robots" content="index, follow" />
          <meta name="theme-color" content="#222" />
          <meta property="og:site_name" content={ baseDomain } />
          <link rel="icon" type="image/png" href="/img/bsd_introvert.png" />
          {this.props.styles}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
