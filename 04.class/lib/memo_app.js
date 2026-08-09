import minimist from "minimist";
import readline from "node:readline/promises";
import enquirer from "enquirer";

const { Select } = enquirer;

export default class MemoApp {
  #memoRepository;

  constructor(memoRepository) {
    this.#memoRepository = memoRepository;
  }

  async run(argv) {
    await this.#memoRepository.createTable();
    const options = this.#parseOptions(argv);

    if (options.l) {
      await this.#listFirstLines();
    } else if (options.r) {
      await this.#referenceMemo();
    } else if (options.d) {
      await this.#deleteMemo();
    } else {
      await this.#addMemo();
    }

    await this.#memoRepository.close();
  }

  #parseOptions(argv) {
    return minimist(argv, {
      default: {
        l: false,
        r: false,
        d: false,
      },
    });
  }

  async #listFirstLines() {
    const memos = await this.#memoRepository.selectAll();
    if (this.#warnIfEmpty(memos)) {
      return;
    }
    memos.forEach((memo) => {
      console.log(memo.firstLine);
    });
  }

  async #referenceMemo() {
    const message = "Choose a memo you want to see:";
    const memos = await this.#memoRepository.selectAll();
    if (this.#warnIfEmpty(memos)) {
      return;
    }
    const memo = await this.#runPrompt(memos, message);
    if (memo === null) {
      return;
    }
    console.log(memo.body);
  }

  async #deleteMemo() {
    const message = "Choose a memo you want to delete:";
    const memos = await this.#memoRepository.selectAll();
    if (this.#warnIfEmpty(memos)) {
      return;
    }
    const memo = await this.#runPrompt(memos, message);
    if (memo === null) {
      return;
    }
    await this.#memoRepository.delete(memo.id);
  }

  async #addMemo() {
    const memo = await this.#readFromStdin();
    await this.#memoRepository.insert(memo);
  }

  #warnIfEmpty(memos) {
    if (memos.length === 0) {
      console.log("No memos found.");
      console.log("Run without options to add a memo.");
      return true;
    }
    return false;
  }

  async #runPrompt(memos, message) {
    const prompt = new Select({
      name: "memo",
      message,
      choices: memos.map((memo) => ({
        name: memo.firstLine,
        value: memo,
      })),
      result() {
        return this.focused.value;
      },
    });

    try {
      return await prompt.run();
    } catch (error) {
      if (error === "") {
        return null;
      } else {
        throw error;
      }
    }
  }

  #readFromStdin() {
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
