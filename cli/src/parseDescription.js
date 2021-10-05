const { normaliseContent } = require("./utils")

const parseDescription = (tokens, config) => {
  let inH2Tag = false
  let inDescriptionSection = false
  const descriptionTokens = []
  for (const token of tokens) {
    if (
      inDescriptionSection &&
      token.type === "heading_open" &&
      token.tag === "h2"
    ) {
      inDescriptionSection = false
      break
    }
    if (token.type === "heading_open" && token.tag === "h2") {
      inH2Tag = true
      continue
    }
    if (
      inH2Tag &&
      token.type === "inline" &&
      normaliseContent(token.content) === config.description.label
    ) {
      inDescriptionSection = true
      continue
    }
    if (token.type === "heading_close" && token.tag === "h2") {
      inH2Tag = false
      continue
    }
    if (inDescriptionSection) {
      descriptionTokens.push(token)
    }
  }
  return descriptionTokens
}

module.exports = { parseDescription }
