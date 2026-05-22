import readline from "node:readline/promises";
import Enquirer from "enquirer";

const { Select } = Enquirer;

export default class MemoApp {
  #memoRepository;

  constructor(memoRepository) {
    this.#memoRepository = memoRepository;
  }

  listFirstLine(memos) {
    memos.forEach((memo) => {
      console.log(memo.firstLine);
    });
  }

  async referenceMemo(memos) {
    const message = "Choose a memo you want to see:";
    const memo = await this.#runPrompt(memos, message);
    if (memo === null) {
      return;
    }
    console.log(memo.body);
  }

  async deleteMemo(memos) {
    const message = "Choose a memo you want to delete:";
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
