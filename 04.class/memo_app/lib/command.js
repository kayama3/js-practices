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
    await this.#db.run(
      "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, body TEXT NOT NULL)"
    );

    if (this.#opt.isList) {
      await this.#listHeadOfLine();
    } else if (this.#opt.isReference) {
      await this.#referenceNote();
    } else if (this.#opt.isDelete) {
      await this.#deleteNote();
    } else {
      await this.#inputNote();
    }

    await this.#db.close();
  }

  async #listHeadOfLine() {
    const records = await this.#db.all("SELECT * FROM notes ORDER BY id");

    records.forEach((row) => {
      const note = new Note(row.id, row.body);
      console.log(note.headOfLine);
    });
  }

  async #referenceNote() {
    const records = await this.#db.all("SELECT * FROM notes ORDER BY id");
    if (!records.length) {return console.log('This app does not contain any note.\nPlease create a note.');}
    const choices = this.#buildChoices(records);
    const prompt = this.#buildReferencePrompt(
      choices,
      "Choose a note you want to see:"
    );

    try {
      await prompt.run();
    } catch (error) {
      console.log(error);
    }
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
    const records = await this.#db.all("SELECT * FROM notes ORDER BY id");
    if (!records.length) {return console.log('This app does not contain any note.\nPlease create a note.');}
    const choices = this.#buildChoices(records);
    const prompt = this.#buildDeletePrompt(
      choices,
      "Choose a note you want to delete:"
    );

    try {
      const noteId = await prompt.run();
      await this.#db.run(`DELETE FROM notes WHERE id=${noteId}`);
    } catch (error) {
      console.log(error);
    }
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
    await this.#db.run(
      `INSERT INTO notes (body) VALUES ('${body.join("\n")}')`
    );
  }

  #buildBody(lines, rl) {
    return new Promise((resolve) => {
      rl.on("line", (line) => {
        lines.push(line);
      });

      rl.on("close", () => {
        resolve(lines);
      });
    });
  }
}
