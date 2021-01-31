export const siteTitle = 'RyLaB';

export default function Layout({ children }) {
  return (
    <>
      <main>{children}</main>
      <div id="footer">
        <p className="small light">
          <a href="mailto:0@rylab.com">1@rylab.com</a>
          &nbsp;&middot;&nbsp;
          <a
            alt="Content license URL alias for: CC BY-NC-SA 4.0"
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            title="Creative Commons BY-NC-SA 4.0">
            some rights reserved</a>
        </p>
      </div>
    </>
  )
}
