export default class Memo {
  #id;
  #body;

  constructor(id, body) {
    this.#id = id;
    this.#body = body;
  }

  get id() {
    return this.#id;
  }

  get body() {
    return this.#body;
  }

  get headOfLine() {
    return this.#body.split("\n")[0];
  }
}
