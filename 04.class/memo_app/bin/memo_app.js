import minimist from "minimist";
import sqlite3 from "sqlite3";
import { Main } from "../lib/main.js";

const defaultOptions = {
  default: {
    l: false,
    r: false,
    d: false,
  },
};
const argv = minimist(process.argv.slice(2), defaultOptions);
const database = new sqlite3.Database('memo.db');
new Main(argv, database).exec();
