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
    const memoId = await this.#runPrompt(memos, message);
    if (memoId === null) {
      return;
    }
    const memo = await this.#memoRepository.select(memoId);
    console.log(memo.body);
  }

  async deleteMemo(memos) {
    const message = "Choose a memo you want to delete:";
    const memoId = await this.#runPrompt(memos, message);
    if (memoId === null) {
      return;
    }
    await this.#memoRepository.delete(memoId);
  }

  async addMemo() {
    const body = await this.#buildBody();
    await this.#memoRepository.insert(body);
  }

  async #runPrompt(memos, message) {
    const choices = this.#buildChoices(memos);
    const prompt = this.#buildPrompt(choices, message);

    try {
      return await prompt.run();
    } catch (error) {
      if (error === "") {
        return null;
      }
    }
  }

  #buildChoices(memos) {
    return memos.map((memo) => ({ message: memo.firstLine, name: memo.id }));
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
