import minimist from "minimist";

import MemoApp from "../lib/memo_app.js";
import SqliteClient from "../lib/sqlite_client.js";
import MemoRepository from "../lib/memo_repository.js";

const database = new SqliteClient();
const memoRepository = new MemoRepository(database);
const memoApp = new MemoApp(memoRepository);

await memoRepository.createTable();
const memos = await memoRepository.selectAll();
const options = parseOptions();

if (memos.length === 0 && (options.l || options.r || options.d)) {
  console.log("This app does not contain any memo.");
  console.log("Please create a memo.");
} else if (options.l) {
  memoApp.listFirstLine(memos);
} else if (options.r) {
  await memoApp.referenceMemo(memos);
} else if (options.d) {
  await memoApp.deleteMemo(memos);
} else {
  await memoApp.addMemo();
}

await database.close();

function parseOptions() {
  return minimist(process.argv.slice(2), {
    default: {
      l: false,
      r: false,
      d: false,
    },
  });
}
