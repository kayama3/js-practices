import { Option } from "./option.js";
import { Note } from "./note.js";
import { sqliteInterface } from "./sqlite_interface.js";
import * as readline from "node:readline/promises";
import Enquirer from "enquirer";
const { Select } = Enquirer;

export class Command {
  #opt;
  #db;

  constructor(argv, db) {
    this.#opt = new Option(argv);
    this.#db = new sqliteInterface(db);
  }

  async exec() {
    await this.#db.createTable();

    if (this.#opt.isList) {
      await this.#listHeadOfLine();
    } else if (this.#opt.isReference) {
      await this.#referenceNote();
    } else if (this.#opt.isDelete) {
      await this.#deleteNote();
    } else {
      await this.#inputNote();
    }

    await this.#db.closeTable();
  }

  async #listHeadOfLine() {
    const records = await this.#db.collectAll();

    records.forEach((row) => {
      const note = new Note(row.id, row.body);
      console.log(note.headOfLine);
    });
  }

  async #referenceNote() {
    const memoId = await this.#runReferencePrompt();
    const memo = await this.#db.getMemo(memoId);
    console.log(memo.body)
  }

  async #runReferencePrompt() {
    const records = await this.#db.collectAll();
    if (!records.length) {return console.log('This app does not contain any note.\nPlease create a note.');}
    const choices = this.#buildChoices(records);
    const prompt = this.#buildReferencePrompt(
      choices,
      "Choose a note you want to see:"
    );

    return await prompt.run();
  }

  #buildChoices(records) {
    const choices = [];

    records.forEach((row) => {
      const note = new Note(row.id, row.body);

      choices.push({
        message: note.headOfLine,
        name: note.id,
        value: note.body,
      });
    });

    return choices;
  }

  #buildReferencePrompt(notes, text) {
    return new Select({
      name: "note",
      message: text,
      choices: notes,
      footer() {
        return "\n" + notes[this.index]["value"];
      },
    });
  }

  async #deleteNote() {
    const noteId = await this.#runDeletePrompt();
    await this.#db.deleteRecord(noteId);
  }

  async #runDeletePrompt() {
    const records = await this.#db.collectAll();
    if (!records.length) {return console.log('This app does not contain any note.\nPlease create a note.');}
    const choices = this.#buildChoices(records);
    const prompt = this.#buildDeletePrompt(
      choices,
      "Choose a note you want to delete:"
    );

    return await prompt.run();
  }

  #buildDeletePrompt(notes, text) {
    return new Select({
      name: "note",
      message: text,
      choices: notes,
    });
  }

  async #inputNote() {
    const lines = [];
    const rl = readline.createInterface({
      input: process.stdin,
    });

    const body = await this.#buildBody(lines, rl);
    await this.#db.insertRecord(body)
  }

  #buildBody(lines, rl) {
    return new Promise((resolve) => {
      rl.on("line", (line) => {
        lines.push(line);
      });

      rl.on("close", () => {
        resolve(lines.join('\n'));
      });
    });
  }
}
