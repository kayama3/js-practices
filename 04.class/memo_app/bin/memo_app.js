import minimist from "minimist";
import { Main } from "../lib/main.js";

const defaultOptions = {
  default: {
    l: false,
    r: false,
    d: false,
  },
};
const argv = minimist(process.argv.slice(2), defaultOptions);
new Main(argv).exec();
