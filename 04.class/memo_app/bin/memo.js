#!/usr/bin/env node

import minimist from "minimist";

import MemoApp from "../lib/memo_app.js";
import SqliteClient from "../lib/sqlite_client.js";
import MemoRepository from "../lib/memo_repository.js";

const sqliteClient = new SqliteClient();
const memoRepository = new MemoRepository(sqliteClient);
const memoApp = new MemoApp(memoRepository);

function parseOptions() {
  return minimist(process.argv.slice(2), {
    default: {
      l: false,
      r: false,
      d: false,
    },
  });
}

await memoRepository.createTable();
const options = parseOptions();

if (options.l) {
  await memoApp.listFirstLine();
} else if (options.r) {
  await memoApp.referenceMemo();
} else if (options.d) {
  await memoApp.deleteMemo();
} else {
  await memoApp.addMemo();
}

await sqliteClient.close();
