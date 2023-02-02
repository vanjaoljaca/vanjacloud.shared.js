"use strict";
// testable-http-triggered-function/__tests__/index.test.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const keys_1 = __importDefault(require("../keys"));
const openai_1 = require("openai");
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
// const ChatGPTAPI = require('chatgpt').ChatGPTAPI;
// import { ChatGPTAPI } from 'chatgpt'
// https://www.npmjs.com/package/openai
const configuration = new openai_1.Configuration({
    apiKey: keys_1.default.openai,
});
const openai = new openai_1.OpenAIApi(configuration);
async function withLocalCache(filename, fn) {
    if (fs.existsSync(filename)) {
        return JSON.parse(fs.readFileSync(filename, 'utf-8'));
    }
    if (process.env.GITHUB_ACTION) {
        throw new Error('Remote interaction disabled for CI tests. Check in snapshots instead.');
    }
    const result = await fn();
    const unwrapped = {
        data: result.data,
        status: result.status,
        statusText: result.statusText,
        headers: result.headers,
        config: result.config
    };
    fs.writeFileSync(filename, JSON.stringify(unwrapped));
    return result;
}
async function testOpenAI(version, prompt) {
    const promptHash = Buffer.from(prompt).toString('base64');
    const destfolder = path_1.default.join('./testdata/openai/', version.toString());
    const filename = path_1.default.join(destfolder, 'response.' + promptHash + '.json');
    return withLocalCache(filename, () => openai.createCompletion({
        model: "text-davinci-00" + version,
        prompt: prompt,
    }));
}
describe('openai', () => {
    it('can do basic stuff', async () => {
        const prompt = "A single word synonym for test: ";
        let r2 = await testOpenAI(2, prompt);
        let r3 = await testOpenAI(3, prompt);
    });
});
//# sourceMappingURL=index.test.js.map