import readline from "node:readline/promises";
import Enquirer from "enquirer";
import { Memo } from "./memo.js";
import SqliteClient from "./sqlite_client.js";
import MemoRepository from "./memo_repository.js";
const { Select } = Enquirer;
import minimist from "minimist";

export class Main {
  #database;

  constructor() {
    this.#database = new SqliteClient();
    this.memoRepository = new MemoRepository(this.#database);
  }

  async exec() {
    const opts = this.#parseOptions();
    await this.memoRepository.createTable();
    const records = await this.memoRepository.all();
    const memos = records.map((row) => {
      return new Memo(row.id, row.body);
    });

    if (memos.length === 0) {
      console.log("This app does not contain any memo.");
      console.log("Please create a memo.");
    }

    if (opts.l) {
      await this.#listHeadOfLine(memos);
    } else if (opts.r) {
      await this.#referenceMemo(memos);
    } else if (opts.d) {
      await this.#deleteMemo(memos);
    } else {
      await this.#inputMemo();
    }

    await this.#database.close();
  }

  #parseOptions() {
    return minimist(process.argv.slice(2), {
      default: {
        'l': false,
        'r': false,
        'd': false
      }
    })
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

  async #listHeadOfLine(memos) {
    memos.forEach((memo) => {
      console.log(memo.headOfLine);
    });
  }

  async #referenceMemo(memos) {
    const memoId = await this.#runReferencePrompt(memos);
    const memo = await this.memoRepository.get(memoId);
    console.log(memo.body);
  }

  async #runReferencePrompt(memos) {
    const choices = this.#buildChoices(memos);
    const prompt = await this.#buildReferencePrompt(
      choices,
      "Choose a memo you want to see:"
    );

    return await prompt.run();
  }

  #buildChoices(memos) {
    const choices = [];

    memos.forEach((memo) => {
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

  async #deleteMemo(memos) {
    const memoId = await this.#runDeletePrompt(memos);
    await this.memoRepository.delete(memoId);
  }

  async #runDeletePrompt(memos) {
    const choices = this.#buildChoices(memos);
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
