const {
  TAGS,
} = require("../../examples/horizontally-sliced-project/archmd.config")
const { normaliseContent } = require("./utils")

class Link {
  constructor() {
    this.url = ""
    this.label = ""
  }
}

const parseList = tokens => {
  let inLiTagDepth = 0
  const liTagSets = []
  for (const token of tokens) {
    if (token.tag === "li" && token.type === "list_item_open") {
      inLiTagDepth += 1
      continue
    }
    if (token.tag === "li" && token.type === "list_item_close") {
      inLiTagDepth -= 1
      continue
    }
    if (inLiTagDepth > 0) {
      if (token.type === "inline") {
        let inAnchorTag = false
        const link = new Link()
        for (const child of token.children) {
          if (!inAnchorTag && child.type == "text") {
            link.label = child.content
            continue
          }
          if (child.type === "link_open") {
            inAnchorTag = true
            link.url = child.attrs.find(attr => attr[0] === "href")[1]
            continue
          }
          if (child.type === "link_close") {
            inAnchorTag = false
            continue
          }
        }
        liTagSets.push(link)
      }
    }
  }
  return liTagSets
}

const parseLinksTo = (tokens, config) => {
  let inH2Tag = false
  let inLinksToSection = false
  const linksToTokens = []
  for (const token of tokens) {
    if (
      inLinksToSection &&
      token.type === "heading_open" &&
      token.tag === "h2"
    ) {
      inLinksToSection = false
      break
    }
    if (token.type === "heading_open" && token.tag === "h2") {
      inH2Tag = true
      continue
    }
    if (
      inH2Tag &&
      token.type === "inline" &&
      normaliseContent(token.content) === config.linksTo.label
    ) {
      inLinksToSection = true
      continue
    }
    if (token.type === "heading_close" && token.tag === "h2") {
      inH2Tag = false
      continue
    }
    if (inLinksToSection) {
      linksToTokens.push(token)
    }
  }

  // Parse the tokens

  const liTokenSets = parseList(linksToTokens)

  return liTokenSets
}

module.exports = { parseLinksTo }
