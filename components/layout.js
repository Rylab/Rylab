export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'localhost'
export const siteTitle = 'RyLaB';

export default function Layout({ children }) {
  return (
    <>
      <main>{children}</main>
      <div id="footer">
        <p className="small light lockish">
          <a href={`mailto:0@${baseUrl}`}>{ `1@${baseUrl}` }</a>
          &nbsp;&middot;&nbsp;
          <a
            alt="Content license URL alias for: CC BY-NC-SA 4.0"
            className="question"
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            rel="noreferrer"
            target="_blank"
            title="Creative Commons BY-NC-SA 4.0">
            some rights reserved</a>
        </p>
      </div>
    </>
  )
}
