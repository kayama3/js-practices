import {
  createTable,
  insertRecord,
  getAllRecords,
  dropTable,
  closeDatabase,
} from "../promise_functions.js";

async function main() {
  await createTable();

  await insertRecord("オブジェクト指向設計実践ガイド");

  try {
    await insertRecord("オブジェクト指向設計実践ガイド");
  } catch (error) {
    console.error(error);
  }

  try {
    const records = await getAllRecords("foods");
    records.forEach((record) => {
      console.log(record.id, record.title);
    });
  } catch (error) {
    console.error(error);
  }

  await dropTable();
  await closeDatabase();
}

main();
