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

  select(id) {
    return this.#database.get(
      "SELECT * FROM memos WHERE id = ? ORDER BY id",
      id
    );
  }

  selectAll() {
    return this.#database.all("SELECT * FROM memos ORDER BY id");
  }

  delete(id) {
    return this.#database.run("DELETE FROM memos WHERE id = ?", id);
  }
}
