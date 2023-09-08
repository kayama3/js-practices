import { run, all, close } from "../promise_functions.js";

async function main() {
  await run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)"
  );

  let id = await run(
    "INSERT INTO books (title) VALUES('オブジェクト指向設計実践ガイド')"
  );
  console.log(id);

  id = await run("INSERT INTO books (title) VALUES('Webを支える技術')");
  console.log(id);

  const records = await all("SELECT * FROM books");
  records.forEach((record) => {
    console.log(record.id, record.title);
  });

  await run("DROP TABLE books");

  await close();
}

main();
