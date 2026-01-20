import readline from "node:readline/promises";
import Enquirer from "enquirer";
import minimist from "minimist";

import Memo from "./memo.js";

const { Select } = Enquirer;

export default class Main {
  #database;
  #memoRepository;

  constructor(database, memoRepository) {
    this.#database = database;
    this.#memoRepository = memoRepository;
  }

  async exec() {
    await this.#memoRepository.createTable();
    const records = await this.#memoRepository.all();
    const memos = records.map((row) => {
      return new Memo(row.id, row.body);
    });
    const options = this.#parseOptions();

    if (memos.length === 0 && (options.l || options.r || options.d)) {
      console.log("This app does not contain any memo.");
      console.log("Please create a memo.");
      await this.#database.close();
      return;
    }

    if (options.l) {
      await this.#listFirstLine(memos);
    } else if (options.r) {
      await this.#referenceMemo(memos);
    } else if (options.d) {
      await this.#deleteMemo(memos);
    } else {
      await this.#addMemo();
    }

    await this.#database.close();
  }

  #parseOptions() {
    return minimist(process.argv.slice(2), {
      default: {
        l: false,
        r: false,
        d: false,
      },
    });
  }

  async #listFirstLine(memos) {
    memos.forEach((memo) => {
      console.log(memo.firstLine);
    });
  }

  async #referenceMemo(memos) {
    const message = "Choose a memo you want to see:";
    const memoId = await this.#runPrompt(memos, message);
    const memo = await this.#memoRepository.get(memoId);
    console.log(memo.body);
  }

  async #deleteMemo(memos) {
    const message = "Choose a memo you want to delete:";
    const memoId = await this.#runPrompt(memos, message);
    await this.#memoRepository.delete(memoId);
  }

  async #addMemo() {
    const body = await this.#buildBody();
    await this.#memoRepository.add(body);
  }

  async #runPrompt(memos, message) {
    const choices = this.#buildChoices(memos);
    const prompt = this.#buildPrompt(choices, message);

    return await prompt.run();
  }

  #buildChoices(memos) {
    return memos.map((memo) => {
      return {
        message: memo.firstLine,
        name: memo.id,
      };
    });
  }

  #buildPrompt(choices, text) {
    return new Select({
      name: "memo",
      message: text,
      choices: choices,
    });
  }

  #buildBody() {
    const lines = [];
    const rl = readline.createInterface({
      input: process.stdin,
    });

    return new Promise((resolve) => {
      rl.on("line", (line) => {
        lines.push(line);
      });

      rl.on("close", () => {
        resolve(lines.join("\n"));
      });
    });
  }
}
