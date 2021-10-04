# Architecture.md

## Description

Architecture.md is an in-code way to describe the architecture of a software project. It let you write human readable Markdown files alongside your code to describe architecture across repositories from the system level to as low as you want to go.

It supports the usual Github style of Markdown along with [MermaidJS](http://mermaid-js.github.io/mermaid/#/) for flow charts and swimlane diagrams. Alonside these it also recognises some special keyword titles to provide extra metadata.

`arch-md` is a command-line tool that can then be run on a project to generate a browsable [C4-like map](https://c4model.com/) of the project - basically a map-like zoomable interface to see the project at the level that you want.
