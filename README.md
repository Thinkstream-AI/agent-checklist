# agent-checklist

This is a CLI tool designed for code agents like Cursor. It leverages Bun as its runtime, package manager, and build tool. The tool uses Bun's built-in SQLite integration to store and manage data.

## Installation

To install dependencies:

```bash
bun install
```

## Usage

To run the CLI tool:

```bash
bun run index.ts <command> [options]
```

Or, once the package is linked or published:

```bash
agent-checklist <command> [options]
```

## How it works

The CLI tool will provide various commands to interact with a checklist of items. These items are stored in a SQLite database managed by Bun.

_(More details on specific commands and options will be added as development progresses)_

This project was created using `bun init` and is built with [Bun](https://bun.sh), a fast all-in-one JavaScript runtime.
