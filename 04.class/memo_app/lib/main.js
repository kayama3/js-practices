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

    if (memos.length === 0) {
      console.log("This app does not contain any memo.");
      console.log("Please create a memo.");
    }

    const opts = this.#parseOptions();

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

  async #inputMemo() {
    const body = await this.#buildBody();
    await this.#memoRepository.add(body);
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
    return memos.map(memo => {
      return {
        message: memo.headOfLine,
        name: memo.id
      };
    })
  }

  #buildPrompt(memos, text) {
    return new Select({
      name: "memo",
      message: text,
      choices: memos,
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
