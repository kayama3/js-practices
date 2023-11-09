export class Memo {
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
    return this.#sliceBody();
  }

  #sliceBody() {
    if (this.#body.includes("\n")) {
      return this.#body.slice(0, this.#body.indexOf("\n"));
    } else {
      return this.#body;
    }
  }
}
