import { run, all, close } from "../promise_functions.js";

async function main() {
  await run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)"
  );

  await run(
    "INSERT INTO books (title) VALUES('オブジェクト指向設計実践ガイド')"
  );

  try {
    await run(
      "INSERT INTO books (title) VALUES('オブジェクト指向設計実践ガイド')"
    );
  } catch (error) {
    console.error(error);
  }

  try {
    const records = await all("SELECT * FROM books");
    records.forEach((record) => {
      console.log(record.id, record.title);
    });
  } catch (error) {
    console.error(error);
  }

  await run("DROP TABLE books");
  await close();
}

main();
