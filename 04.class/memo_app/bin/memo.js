#!/usr/bin/env node

import MemoApp from "../lib/memo_app.js";
import SqliteClient from "../lib/sqlite_client.js";
import MemoRepository from "../lib/memo_repository.js";

const sqliteClient = new SqliteClient("./memo.db");
const memoRepository = new MemoRepository(sqliteClient);
await new MemoApp(memoRepository).run(process.argv.slice(2));
