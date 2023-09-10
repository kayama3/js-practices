import { run, all, close } from "../promise_functions.js";
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(':memory:');

async function main() {
  await run(
    db, "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)"
  );

  await run(
    db, "INSERT INTO books (title) VALUES('オブジェクト指向設計実践ガイド')"
  );

  try {
    await run(
      db, "INSERT INTO books (title) VALUES('オブジェクト指向設計実践ガイド')"
    );
  } catch (error) {
    console.error(error);
  }

  try {
    const records = await all(db, "SELECT * FROM books");
    records.forEach((record) => {
      console.log(record.id, record.title);
    });
  } catch (error) {
    console.error(error);
  }

  await run(db, "DROP TABLE books");
  await close(db);
}

main();
