import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run("INSERT INTO books (title)", (err) => {
      if (err && err.code === "SQLITE_ERROR") {
        console.error(err.message);
      }

      db.each("SELECT * FROM foods", (err) => {
        if (err && err.code === "SQLITE_ERROR") {
          console.error(err.message);
        }

        db.run("DROP TABLE books", () => {
          db.close();
        });
      });
    });
  }
);
