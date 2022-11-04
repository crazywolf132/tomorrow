var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  LogBackend: () => LogBackend,
  default: () => Log
});
module.exports = __toCommonJS(src_exports);
var import_ms = __toESM(require("ms"));
var import_chalk = __toESM(require("chalk"));
var LogBackend = class {
  constructor(name, color) {
    this.name = name;
    this.color = color;
  }
  getTimeDifference() {
    const currentTime = Number(new Date());
    const _ms = currentTime - (this.prevTime || currentTime);
    this.prevTime = currentTime;
    return _ms;
  }
  clean(difference) {
    return (0, import_ms.default)(difference);
  }
  getPrefix(...parts) {
    let prefix = [this.name];
    let rest = [];
    for (const part of parts) {
      if (typeof part === "string") {
        if (part.endsWith(":")) {
          prefix.push(part.replace(":", ""));
          continue;
        }
      }
      rest.push(part);
    }
    return [`${import_chalk.default.hex(this.color)(`${prefix.join(":")}:`.replace("::", ":"))}`, ...rest];
  }
  log(...parts) {
    const [prefix, ...rest] = this.getPrefix(...parts);
    console.log(prefix, ...rest, `${import_chalk.default.hex(this.color)(this.clean(this.getTimeDifference()))}`);
  }
  getLogger() {
    return (...parts) => this.log(...parts);
  }
};
var Log = class {
  static getByName(name) {
    if (!(name in this.registered)) {
      const newColor = this.getRandomColor();
      this.usedColors.push(newColor);
      const lb = new LogBackend(name, newColor);
      this.registered[name] = lb.getLogger();
    }
    return this.registered[name];
  }
  static getRandomColor() {
    let color;
    do {
      color = "#" + (16777216 + Math.random() * 16777215).toString(16).slice(0, 5);
    } while (this.usedColors.includes(color));
    return color;
  }
  static get(name) {
    return this.getByName(name);
  }
  static setLevel(enabled = true) {
    this.enabled = enabled;
  }
  static getLevel() {
    return this.enabled;
  }
};
Log.registered = {};
Log.usedColors = [];
Log.enabled = false;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LogBackend
});
