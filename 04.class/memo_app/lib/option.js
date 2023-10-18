export class Option {
  #argv;

  constructor(argv) {
    this.#argv = argv;
  }

  get isList() {
    return this.#argv.l;
  }

  get isReference() {
    return this.#argv.r;
  }

  get isDelete() {
    return this.#argv.d;
  }
}
