import readline from "node:readline/promises";
import Enquirer from "enquirer";
import { Option } from "./option.js";
import { Memo } from "./memo.js";
import SqliteClient from "./sqlite_client.js";
import MemoRepository from "./memo_repository.js";
const { Select } = Enquirer;

export class Main {
  #option;
  #database;

  constructor(option) {
    this.#option = new Option(option);
    this.#database = new SqliteClient();
    this.memoRepository = new MemoRepository(this.#database);
  }

  async exec() {
    await this.memoRepository.createTable();

    if (!this.#option.isAnyOptionTrue) {
      await this.#inputMemo();
      await this.#database.close();
      return;
    }

    const records = await this.memoRepository.all();

    if (records.length === 0) {
      console.log("This app does not contain any memo.");
      console.log("Please create a memo.");
      await this.#database.close();
      return;
    }

    if (this.#option.isList) {
      await this.#listHeadOfLine(records);
    } else if (this.#option.isReference) {
      await this.#referenceMemo(records);
    } else if (this.#option.isDelete) {
      await this.#deleteMemo(records);
    }

    await this.#database.close();
  }

  async #inputMemo() {
    const lines = [];
    const rl = readline.createInterface({
      input: process.stdin,
    });

    const body = await this.#buildBody(lines, rl);
    await this.memoRepository.add(body);
  }

  #buildBody(lines, rl) {
    return new Promise((resolve) => {
      rl.on("line", (line) => {
        lines.push(line);
      });

      rl.on("close", () => {
        resolve(lines.join("\n"));
      });
    });
  }

  async #listHeadOfLine(records) {
    records.forEach((row) => {
      const memo = new Memo(row.id, row.body);
      console.log(memo.headOfLine);
    });
  }

  async #referenceMemo(records) {
    const memoId = await this.#runReferencePrompt(records);
    const memo = await this.memoRepository.get(memoId);
    console.log(memo.body);
  }

  async #runReferencePrompt(records) {
    const choices = this.#buildChoices(records);
    const prompt = await this.#buildReferencePrompt(
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

  async #deleteMemo(records) {
    const memoId = await this.#runDeletePrompt(records);
    await this.memoRepository.delete(memoId);
  }

  async #runDeletePrompt(records) {
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
}
