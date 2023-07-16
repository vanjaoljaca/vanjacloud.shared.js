"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGPT = exports.AzureTranslate = exports.ThoughtDB = void 0;
const keys_1 = __importDefault(require("../keys"));
var notion_1 = require("./notion");
Object.defineProperty(exports, "ThoughtDB", { enumerable: true, get: function () { return notion_1.ThoughtDB; } });
var AzureTranslate_1 = require("./AzureTranslate");
Object.defineProperty(exports, "AzureTranslate", { enumerable: true, get: function () { return AzureTranslate_1.AzureTranslate; } });
var ChatGPT_1 = require("./ChatGPT");
Object.defineProperty(exports, "ChatGPT", { enumerable: true, get: function () { return ChatGPT_1.ChatGPT; } });
exports.default = {
    Keys: keys_1.default // lol fix this dumbness
};
//# sourceMappingURL=index.js.map