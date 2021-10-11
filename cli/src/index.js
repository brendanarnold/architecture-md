const Markdown = require("markdown-it")
const FileHound = require("filehound")
const fs = require("fs")
const { promisify } = require("util")
const { normaliseContent } = require("./utils")
const { parseTitle } = require("./parseTitle")
const { parseTags } = require("./parseTags")
const { parseLayer } = require("./parseLayer")
const { parseDescription } = require("./parseDescription")
const { parseLinksTo } = require("./parseLinksTo")
const parseLinkDestination = require("markdown-it/lib/helpers/parse_link_destination")

const readFile = promisify(fs.readFile)

// TODO: Defaults, these overridden by config and command-line options
const config = {
  paths: ["./"],
  ignore: ["node_modules"],
  match: ["DESCRIBE*.md"], // Match DESCRIBE.md, DESCRIBE.foo.md
  tags: {
    label: "technology",
    values: [
      {
        name: "spa",
        synonyms: ["single page app"],
      },
    ],
  },
  description: {
    label: "description",
  },
  linksTo: {
    label: "dependencies",
  },
  layers: {
    label: "layer",
    values: [
      {
        name: "system",
      },
      {
        name: "container",
      },
      {
        name: "component",
      },
      {
        name: "code",
      },
    ],
  },
}

const parseSection = tokens => {
  return {
    title: parseTitle(tokens),
    description: parseDescription(tokens, config),
    layer: parseLayer(tokens, config),
    tags: parseTags(tokens, config),
    linksTo: parseLinksTo(tokens, config),
  }
}

const parseMarkdown = content => {
  const md = new Markdown()
  const tokens = md.parse(content)

  // TODO: Support multiple sections
  return parseSection(tokens)
}

const main = async () => {
  const files = FileHound.create()
    .paths(config.paths)
    .discard(config.ignore)
    .match(config.match)
    .findSync()

  for (const file of files) {
    const content = await readFile(file, "utf-8")

    const node = parseMarkdown(content)

    console.log(node)
  }
}

main()
