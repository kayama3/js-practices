import { run, all, close } from "../promise_functions.js";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

async function main() {
  await run(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)"
  );

  await run(
    db,
    "INSERT INTO books (title) VALUES('オブジェクト指向設計実践ガイド')"
  );

  try {
    await run(
      db,
      "INSERT INTO books (title) VALUES('オブジェクト指向設計実践ガイド')"
    );
  } catch (error) {
    if (error.code == "SQLITE_CONSTRAINT") {
      console.error(error.message);
    } else {
      throw error;
    }
  }

  try {
    const records = await all(db, "SELECT * FROM foods");
    records.forEach((record) => {
      console.log(record.id, record.title);
    });
  } catch (error) {
    if (error.code == "SQLITE_ERROR") {
      console.error(error.message);
    } else {
      throw error;
    }
  }

  await run(db, "DROP TABLE books");
  await close(db);
}

main();
