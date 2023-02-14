"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.getOrCreateCompletion = exports.withLocalCache = void 0;
const openai_1 = require("openai");
const keys_1 = __importDefault(require("../keys"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const configuration = new openai_1.Configuration({
  apiKey: keys_1.default.openai,
});
const openai = new openai_1.OpenAIApi(configuration);

async function withLocalCache(filename, fn, isExpired) {
  if (fs_1.default.existsSync(filename)) {
    let d = JSON.parse(fs_1.default.readFileSync(filename, 'utf-8'));
    if (isExpired == null || !(await isExpired(d))) {
      return d;
    }
    fs_1.default.rmSync(filename);
  }
  if (process.env.GITHUB_ACTION) {
    throw new Error(
        'Remote interaction disabled for CI tests. Check in snapshots instead.');
  }
  const result = await fn();
  const unwrapped = {
    data: result.data,
    status: result.status,
    statusText: result.statusText,
    headers: result.headers,
    config: result.config
  };
  fs_1.default.writeFileSync(filename, JSON.stringify(unwrapped));
  return result;
}
exports.withLocalCache = withLocalCache;
async function getOrCreateCompletion(version, prompt) {
  const promptHash = Buffer.from(prompt).toString('base64');
  const destfolder = path_1.default.join('./testdata/openai/',
      version.toString());
  const filename = path_1.default.join(destfolder,
      'response.' + promptHash + '.json');
  return withLocalCache(filename, () => openai.createCompletion({
    model: "text-davinci-00" + version,
    prompt: prompt,
  }));
}
exports.getOrCreateCompletion = getOrCreateCompletion;
//# sourceMappingURL=openai.js.map