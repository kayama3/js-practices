import { Option } from "./option.js";
import { Memo } from "./memo.js";
import { sqliteInterface } from "./sqlite_interface.js";
import readline from "node:readline/promises";
import Enquirer from "enquirer";
const { Select } = Enquirer;

export class Command {
  #opt;
  #db;

  constructor(argv, db) {
    this.#opt = new Option(argv);
    this.#db = new sqliteInterface(db);
  }

  async exec() {
    await this.#db.createTable();

    if (this.#opt.isList) {
      await this.#listHeadOfLine();
    } else if (this.#opt.isReference) {
      await this.#referenceMemo();
    } else if (this.#opt.isDelete) {
      await this.#deleteMemo();
    } else {
      await this.#inputMemo();
    }

    await this.#db.closeTable();
  }

  async #listHeadOfLine() {
    const records = await this.#db.collectAll();

    records.forEach((row) => {
      const memo = new Memo(row.id, row.body);
      console.log(memo.headOfLine);
    });
  }

  async #referenceMemo() {
    const memoId = await this.#runReferencePrompt();
    const memo = await this.#db.getMemo(memoId);
    console.log(memo.body)
  }

  async #runReferencePrompt() {
    const records = await this.#db.collectAll();
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
    await this.#db.deleteRecord(memoId);
  }

  async #runDeletePrompt() {
    const records = await this.#db.collectAll();
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
    await this.#db.insertRecord(body)
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
