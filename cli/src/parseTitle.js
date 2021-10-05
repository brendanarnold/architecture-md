const parseTitle = tokens => {
  let inTitle = false
  let title = ""
  for (const token of tokens) {
    if (token.type === "heading_open" && token.tag === "h1") {
      inTitle = true
    }
    if (token.type === "heading_close" && token.tag === "h1") {
      inTitle = false
    }
    if (inTitle && token.type === "inline") {
      title += token.content
    }
  }
  return title
}

module.exports = { parseTitle }
