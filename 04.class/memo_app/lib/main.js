import readline from "node:readline/promises";
import Enquirer from "enquirer";
import Memo from "./memo.js";
const { Select } = Enquirer;
import minimist from "minimist";

export default class Main {
  #database;
  #memoRepository;

  constructor(database, memoRepository) {
    this.#database = database;
    this.#memoRepository = memoRepository;
  }

  async exec() {
    const opts = this.#parseOptions();
    await this.#memoRepository.createTable();
    const records = await this.#memoRepository.all();
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
    const body = await this.#buildBody();
    await this.#memoRepository.add(body);
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

  async #listHeadOfLine(memos) {
    memos.forEach((memo) => {
      console.log(memo.headOfLine);
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

  async #runPrompt(memos, message) {
    const choices = this.#buildChoices(memos);
    const prompt = this.#buildPrompt(
      choices,
      message
    );

    return await prompt.run();
  }

  #buildChoices(memos) {
    const choices = [];

    memos.forEach((memo) => {
      choices.push({
        message: memo.headOfLine,
        name: memo.id,
      });
    });

    return choices;
  }

  #buildPrompt(memos, text) {
    return new Select({
      name: "memo",
      message: text,
      choices: memos,
    });
  }
}
