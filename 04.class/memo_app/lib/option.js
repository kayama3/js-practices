export class Option {
  #option;

  constructor(option) {
    this.#option = option;
  }

  get isList() {
    return this.#option.l;
  }

  get isReference() {
    return this.#option.r;
  }

  get isDelete() {
    return this.#option.d;
  }
}
