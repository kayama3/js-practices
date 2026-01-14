export default class MemoRepository {
  #sqliteClient;

  constructor(sqliteClient) {
    this.#sqliteClient = sqliteClient;
  }

  createTable() {
    return this.#sqliteClient.run(
      "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY, body TEXT NOT NULL)"
    );
  }

  add(body) {
    return this.#sqliteClient.run("INSERT INTO memos (body) VALUES (?)", body);
  }

  get(memoId) {
    return this.#sqliteClient.get(
      "SELECT * FROM memos WHERE id = ? ORDER BY id",
      memoId
    );
  }

  all() {
    return this.#sqliteClient.all("SELECT * FROM memos ORDER BY id");
  }

  delete(memoId) {
    return this.#sqliteClient.run("DELETE FROM memos WHERE id = ?", memoId);
  }
}
