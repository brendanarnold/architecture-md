const { normaliseContent } = require("./utils")

const parseTags = (tokens, config) => {
  let inH2Tag = false
  let inTagSection = false
  let tags = []
  for (const token of tokens) {
    if (token.type === "heading_open" && token.tag === "h2") {
      if (inTagSection) {
        inTagSection = false
        break
      }
      inH2Tag = true
      continue
    }
    if (
      inH2Tag &&
      token.type === "inline" &&
      normaliseContent(token.content) === config.tags.label
    ) {
      inTagSection = true
      continue
    }
    if (token.type === "heading_close" && token.tag === "h2") {
      inH2Tag = false
      continue
    }
    if (inTagSection && token.type === "inline") {
      tags.push(token.content)
    }
    if (inTagSection && token.type === "heading_open" && token.tag === "h2") {
      inTagSection = false
      break
    }
  }
  return tags
}

module.exports = { parseTags }
