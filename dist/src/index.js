"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const keys_1 = __importDefault(require("../keys"));
const notion_1 = require("./notion");
const AzureTranslate_1 = require("./AzureTranslate");
exports.default = {
  Keys: keys_1.default,
  ThoughtDB: notion_1.ThoughtDB,
  AzureTranslate: AzureTranslate_1.AzureTranslate
};
//# sourceMappingURL=index.js.map