import Main from "../lib/main.js";
import SqliteClient from "../lib/sqlite_client.js";
import MemoRepository from "../lib/memo_repository.js";

const database = new SqliteClient();
const memoRepository = new MemoRepository(database);
new Main(database, memoRepository).exec();
