// testable-http-triggered-function/__tests__/index.test.ts

// import assert = require('assert')
// todo: https://github.com/anthonychu/azure-functions-test-utils
import {getOrCreateCompletion} from "./openai";

// const ChatGPTAPI = require('chatgpt').ChatGPTAPI;
// import { ChatGPTAPI } from 'chatgpt'

// https://www.npmjs.com/package/openai

describe('openai', () => {
    it('can do basic stuff', async () => {
        const prompt = "A single word synonym for test: "
        let r2 = await getOrCreateCompletion(2, prompt)
        let r3 = await getOrCreateCompletion(3, prompt)
    })
})
