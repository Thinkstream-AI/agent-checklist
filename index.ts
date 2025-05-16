#!/usr/bin/env bun

import { Command } from "commander";
import { Database } from "bun:sqlite";

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

program.parse(process.argv);

// Close the database connection when the program exits (optional, Bun might handle this)
// process.on('exit', () => {
//   db.close();
// });
