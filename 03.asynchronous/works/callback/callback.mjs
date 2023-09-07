import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run(
      "INSERT INTO books (title) VALUES('オブジェクト指向設計実践ガイド')",
      () => {
        db.get(
          "SELECT * FROM books WHERE title = 'オブジェクト指向設計実践ガイド'",
          (err, row) => {
            console.log(row.id);

            db.run(
              "INSERT INTO books (title) VALUES('Webを支える技術')",
              () => {
                db.get(
                  "SELECT * FROM books WHERE title = 'Webを支える技術'",
                  (err, row) => {
                    console.log(row.id);

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
      }
    );
  }
);
