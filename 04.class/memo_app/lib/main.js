import readline from "node:readline/promises";
import Enquirer from "enquirer";
import minimist from "minimist";

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
    const memos = await this.#memoRepository.selectAll();
    const options = this.#parseOptions();

    if (memos.length === 0 && (options.l || options.r || options.d)) {
      console.log("This app does not contain any memo.");
      console.log("Please create a memo.");
      await this.#database.close();
      return;
    }

    if (options.l) {
      this.#listFirstLine(memos);
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

  #listFirstLine(memos) {
    memos.forEach((memo) => {
      console.log(memo.firstLine);
    });
  }

  async #referenceMemo(memos) {
    const message = "Choose a memo you want to see:";
    const memoId = await this.#runPrompt(memos, message);
    if (memoId === false) return;
    const memo = await this.#memoRepository.select(memoId);
    console.log(memo.body);
  }

  async #deleteMemo(memos) {
    const message = "Choose a memo you want to delete:";
    const memoId = await this.#runPrompt(memos, message);
    if (memoId === false) return;
    await this.#memoRepository.delete(memoId);
  }

  async #addMemo() {
    const body = await this.#buildBody();
    await this.#memoRepository.insert(body);
  }

  #runPrompt(memos, message) {
    const choices = this.#buildChoices(memos);
    const prompt = this.#buildPrompt(choices, message);

    return prompt.run().catch((error) => {
      if (error === "") return false;
    });
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
