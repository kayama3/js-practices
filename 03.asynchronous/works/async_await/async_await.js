import {
  createTable,
  insertRecord,
  getRecord,
  getAllRecords,
  dropTable,
  closeDatabase,
} from "../promise_functions.js";

async function main() {
  await createTable();

  await insertRecord("オブジェクト指向設計実践ガイド");
  let record = await getRecord("オブジェクト指向設計実践ガイド");
  console.log(record.id);

  await insertRecord("Webを支える技術");
  record = await getRecord("Webを支える技術");
  console.log(record.id);

  const records = await getAllRecords("books");
  records.forEach((record) => {
    console.log(record.id, record.title);
  });

  await dropTable();
  await closeDatabase();
}

main();
