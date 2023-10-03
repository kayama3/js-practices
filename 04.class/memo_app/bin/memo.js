import { Command } from "../lib/command.js";
import minimist from "minimist";
import sqlite3 from "sqlite3";
const argv = minimist(process.argv.slice(2));
const dataBase = new sqlite3.Database("|memory|");

const command = new Command(argv, dataBase);
command.exec();

