import Document, { Html, Head, Main, NextScript } from "next/document";
import React from "react";
import { ServerStyleSheet } from "styled-components";

export default class Rylab extends Document {
  static getInitialProps({ renderPage, _REQ }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage((App) => (props) =>
      sheet.collectStyles(<App {...props} />),
    );
    const styleTags = sheet.getStyleElement();

    return {
      ...page,
      styleTags,
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="content-type" content="text/html;charset=UTF-8" />
          <meta name="author" content='Ryan "Rylab" D. LaBarre' />
          <meta name="language" content="en" />
          <meta name="robots" content="index, follow" />
          <meta name="theme-color" content="#222" />
          <meta property="og:site_name" content="Rylab.com" />
          <link rel="icon" type="image/png" href="/img/bsd_introvert.png" />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
