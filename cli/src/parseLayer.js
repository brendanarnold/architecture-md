const { normaliseContent } = require("./utils")

const parseLayer = (tokens, config) => {
  let inH2Tag = false
  let inLayerSection = false
  let layer = undefined
  for (const token of tokens) {
    if (inLayerSection && token.type === "heading_open" && token.tag === "h2") {
      inLayerSection = false
      break
    }
    if (token.type === "heading_open" && token.tag === "h2") {
      inH2Tag = true
      continue
    }
    if (
      inH2Tag &&
      token.type === "inline" &&
      normaliseContent(token.content) === config.layers.label
    ) {
      inLayerSection = true
      continue
    }
    if (token.type === "heading_close" && token.tag === "h2") {
      inH2Tag = false
      continue
    }
    if (inLayerSection && token.type === "inline") {
      layer = normaliseContent(token.content)
    }
  }
  return layer
}

module.exports = { parseLayer }
