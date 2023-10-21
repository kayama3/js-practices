import minimist from "minimist";
import sqlite3 from "sqlite3";
import { Command } from "../lib/command.js";

const argv = minimist(process.argv.slice(2));
const database = new sqlite3.Database('memo.db');
const command = new Command(argv, database);
command.exec();
