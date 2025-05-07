declare module '*module.css' {
  const styles: {
    [className: string]: string
  }
  export default styles
}

export interface Self {
  alias: string
  error?: boolean
  name: string
  title: string
  url: string
}

export interface Song {
  _id?: string
  artist: string
  bio?: string
  title: string
  spin?: boolean
  style?: CSSProperties
  uuid?: string
}
