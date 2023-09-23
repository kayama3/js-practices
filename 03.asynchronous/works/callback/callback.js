import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run(
      "INSERT INTO books (title) VALUES('オブジェクト指向設計実践ガイド')",
      function () {
        console.log(this.lastID);

        db.run(
          "INSERT INTO books (title) VALUES('Webを支える技術')",
          function () {
            console.log(this.lastID);

            db.all("SELECT * FROM books", (err, rows) => {
              rows.forEach((row) => {
                console.log(row.id, row.title);
              });

              db.run("DROP TABLE books", () => {
                db.close();
              });
            });
          }
        );
      }
    );
  }
);
