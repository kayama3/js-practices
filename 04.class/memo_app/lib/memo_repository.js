import Memo from "./memo.js";

export default class MemoRepository {
  #database;

  constructor(database) {
    this.#database = database;
  }

  createTable() {
    return this.#database.run(
      "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY, body TEXT NOT NULL)"
    );
  }

  insert(body) {
    return this.#database.run("INSERT INTO memos (body) VALUES (?)", body);
  }

  async selectAll() {
    const records = await this.#database.all("SELECT * FROM memos ORDER BY id");
    return records.map((row) => new Memo(row.id, row.body));
  }

  delete(id) {
    return this.#database.run("DELETE FROM memos WHERE id = ?", id);
  }
}
