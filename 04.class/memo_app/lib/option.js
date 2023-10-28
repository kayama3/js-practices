export class Option {
  #option;

  constructor(option) {
    this.#option = option;
  }

  get isAnyOptionTrue() {
    return Object.values(this.#option).some((x) => x === true);
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
