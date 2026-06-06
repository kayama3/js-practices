import readline from "node:readline/promises";
import enquirer from "enquirer";

const { Select } = enquirer;

export default class MemoApp {
  #memoRepository;

  constructor(memoRepository) {
    this.#memoRepository = memoRepository;
  }

  async listFirstLine() {
    const memos = await this.#getAllMemos();
    if (memos === null) {
      return;
    }
    memos.forEach((memo) => {
      console.log(memo.firstLine);
    });
  }

  async referenceMemo() {
    const message = "Choose a memo you want to see:";
    const memos = await this.#getAllMemos();
    if (memos === null) {
      return;
    }
    const memo = await this.#runPrompt(memos, message);
    if (memo === null) {
      return;
    }
    console.log(memo.body);
  }

  async deleteMemo() {
    const message = "Choose a memo you want to delete:";
    const memos = await this.#getAllMemos();
    if (memos === null) {
      return;
    }
    const memo = await this.#runPrompt(memos, message);
    if (memo === null) {
      return;
    }
    await this.#memoRepository.delete(memo.id);
  }

  async addMemo() {
    const body = await this.#buildBody();
    await this.#memoRepository.insert(body);
  }

  async #getAllMemos() {
    const memos = await this.#memoRepository.selectAll();
    if (memos.length === 0) {
      console.log("No memos found.");
      console.log("Run without options to add a memo.");
      return null;
    }
    return memos;
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
      }
    }
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
