import { Option } from "./option.js";
import { Memo } from "./memo.js";
import { SqliteRepository } from "./sqlite_repostory.js";
import readline from "node:readline/promises";
import Enquirer from "enquirer";
const { Select } = Enquirer;

export class Command {
  #option;
  #database;

  constructor(option, database) {
    this.#option = new Option(option);
    this.#database = new SqliteRepository(database);
  }

  async exec() {
    await this.#database.createTable();

    if (this.#option.isList) {
      await this.#listHeadOfLine();
    } else if (this.#option.isReference) {
      await this.#referenceMemo();
    } else if (this.#option.isDelete) {
      await this.#deleteMemo();
    } else {
      await this.#inputMemo();
    }

    await this.#database.closeTable();
  }

  async #listHeadOfLine() {
    const records = await this.#database.collectAll();

    records.forEach((row) => {
      const memo = new Memo(row.id, row.body);
      console.log(memo.headOfLine);
    });
  }

  async #referenceMemo() {
    const memoId = await this.#runReferencePrompt();
    const memo = await this.#database.getMemo(memoId);
    console.log(memo.body)
  }

  async #runReferencePrompt() {
    const records = await this.#database.collectAll();
    if (!records.length) {return console.log('This app does not contain any memo.\nPlease create a memo.');}
    const choices = this.#buildChoices(records);
    const prompt = this.#buildReferencePrompt(
      choices,
      "Choose a memo you want to see:"
    );

    return await prompt.run();
  }

  #buildChoices(records) {
    const choices = [];

    records.forEach((row) => {
      const memo = new Memo(row.id, row.body);

      choices.push({
        message: memo.headOfLine,
        name: memo.id,
        value: memo.body,
      });
    });

    return choices;
  }

  #buildReferencePrompt(memos, text) {
    return new Select({
      name: "memo",
      message: text,
      choices: memos,
      footer() {
        return "\n" + memos[this.index]["value"];
      },
    });
  }

  async #deleteMemo() {
    const memoId = await this.#runDeletePrompt();
    await this.#database.deleteRecord(memoId);
  }

  async #runDeletePrompt() {
    const records = await this.#database.collectAll();
    if (!records.length) {return console.log('This app does not contain any memo.\nPlease create a memo.');}
    const choices = this.#buildChoices(records);
    const prompt = this.#buildDeletePrompt(
      choices,
      "Choose a memo you want to delete:"
    );

    return await prompt.run();
  }

  #buildDeletePrompt(memos, text) {
    return new Select({
      name: "memo",
      message: text,
      choices: memos,
    });
  }

  async #inputMemo() {
    const lines = [];
    const rl = readline.createInterface({
      input: process.stdin,
    });

    const body = await this.#buildBody(lines, rl);
    await this.#database.insertRecord(body)
  }

  #buildBody(lines, rl) {
    return new Promise((resolve) => {
      rl.on("line", (line) => {
        lines.push(line);
      });

      rl.on("close", () => {
        resolve(lines.join('\n'));
      });
    });
  }
}
