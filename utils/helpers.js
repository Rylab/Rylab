export function selectText() {
  let nav
  let sel

  try {
    if (window.getSelection && document.createRange) {
      nav = document.getElementById('navUrl')
      sel = window.getSelection()

      window.setTimeout(() => {
        let range = document.createRange()
        range.selectNodeContents(nav)
        sel.removeAllRanges()
        sel.addRange(range)
        document.execCommand('copy')
        console.log(`https://${sel.toString()} [copied to clipboard]`)
      })
    }
  } catch (e) {
    console.warn('Text selection or clipboard usage not supported.')
  }
}

