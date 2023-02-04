"use strict";
// testable-http-triggered-function/__tests__/index.test.ts
Object.defineProperty(exports, "__esModule", {value: true});
// import assert = require('assert')
// todo: https://github.com/anthonychu/azure-functions-test-utils
const openai_1 = require("./openai");
// const ChatGPTAPI = require('chatgpt').ChatGPTAPI;
// import { ChatGPTAPI } from 'chatgpt'
// https://www.npmjs.com/package/openai
describe('openai', () => {
  it('can do basic stuff', async () => {
    const prompt = "A single word synonym for test: ";
    let r2 = await (0, openai_1.getOrCreateCompletion)(2, prompt);
    let r3 = await (0, openai_1.getOrCreateCompletion)(3, prompt);
  });
});
//# sourceMappingURL=index.test.js.map