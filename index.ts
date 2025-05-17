#!/usr/bin/env bun

import { Command } from "commander";
import { Database } from "bun:sqlite";
import fs from "node:fs";
import path from "node:path";

const program = new Command();
const db = new Database("checklist.sqlite", { create: true });

// Define an interface for our item
interface Item {
	id: number;
	task: string;
	completed: boolean;
}

// Initialize database schema if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE
  );
`);

program
	.name("agent-checklist")
	.description("A CLI tool for managing a checklist for code agents.")
	.version("0.0.1");

program
	.command("add <task>")
	.description("Add a new task to the checklist")
	.action((task: string) => {
		try {
			db.run("INSERT INTO items (task) VALUES (?)", [task]);
			console.log(`Added task: "${task}"`);
		} catch (error) {
			console.error("Failed to add task:", error);
		}
	});

program
	.command("list")
	.description("List all tasks in the checklist")
	.action(() => {
		try {
			const items = db.query("SELECT * FROM items").all() as Item[];
			if (items.length === 0) {
				console.log("No tasks in the checklist.");
				return;
			}
			for (const item of items) {
				console.log(`[${item.completed ? "x" : " "}] ${item.id}: ${item.task}`);
			}
		} catch (error) {
			console.error("Failed to list tasks:", error);
		}
	});

program
	.command("complete <id>")
	.description("Mark a task as completed")
	.action((id: string) => {
		try {
			const taskId = Number.parseInt(id, 10);
			if (Number.isNaN(taskId)) {
				console.error("Invalid task ID.");
				return;
			}
			db.run("UPDATE items SET completed = TRUE WHERE id = ?", [taskId]);
			console.log(`Marked task ${taskId} as completed.`);
		} catch (error) {
			console.error("Failed to complete task:", error);
		}
	});

program
	.command("remove <id>")
	.description("Remove a task from the checklist")
	.action((id: string) => {
		try {
			const taskId = Number.parseInt(id, 10);
			if (Number.isNaN(taskId)) {
				console.error("Invalid task ID.");
				return;
			}
			db.run("DELETE FROM items WHERE id = ?", [taskId]);
			console.log(`Removed task ${taskId}.`);
		} catch (error) {
			console.error("Failed to remove task:", error);
		}
	});

program
	.command("install-rule")
	.description(
		"Install the Cursor rule for this CLI to .cursor/rules/ in the current project",
	)
	.action(() => {
		const ruleFileName = "agent_checklist_cli_usage.mdc";
		const sourcePath = path.join(import.meta.dir, "..", ruleFileName);

		// Use process.cwd() for the current project directory
		const targetDir = path.join(process.cwd(), ".cursor", "rules");
		const targetPath = path.join(targetDir, ruleFileName);

		try {
			if (!fs.existsSync(sourcePath)) {
				console.error(
					`Error: Rule file not found at ${sourcePath}. This might be an issue with the package installation.`,
				);
				return;
			}

			fs.mkdirSync(targetDir, { recursive: true });
			fs.copyFileSync(sourcePath, targetPath);
			console.log(`Successfully copied rule to ${targetPath}`);
			console.log("Please restart Cursor to see the new rule.");
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error(`Failed to install Cursor rule: ${error.message}`);
			} else {
				console.error(
					"Failed to install Cursor rule: An unknown error occurred",
				);
			}
		}
	});

program.parse(process.argv);

// Close the database connection when the program exits (optional, Bun might handle this)
// process.on('exit', () => {
//   db.close();
// });
