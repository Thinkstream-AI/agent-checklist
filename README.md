# Agent Checklist

**agent-checklist** is a CLI tool designed for code agents like [Cursor](https://www.cursor.sh). It creates an sqlite database in your project and manages checklists for your coding agent. It has (for me) reduced hallucinations and weird coding tangents by a lot. It also helps a smaller faster model perform better over long, complex conversations.


## 🚀 Installation

Install project dependencies with:

```bash
bun install
```

## 🛠 Usage

To run the CLI tool:

```bash
bun run index.ts <command> [options]
```

Or, once the package is linked or published:

```bash
agent-checklist <command> [options]
```

## 🧠 How It Works

The CLI tool will provide various commands to interact with a checklist of items. These items are stored in a SQLite database managed by Bun.

> _(More details on specific commands and options will be added as development progresses)_

This project was created using `bun init` and is built with [Bun](https://bun.sh), a fast all-in-one JavaScript runtime.
