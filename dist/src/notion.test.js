"use strict";
// testable-http-triggered-function/__tests__/index.test.ts
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notion_1 = require("./notion");
const keys_1 = __importDefault(require("../keys"));
const moment_1 = __importDefault(require("moment"));
const ChatGPT_1 = require("./ChatGPT");
const openai_1 = __importDefault(require("openai"));
describe('notion', () => {
    jest.setTimeout(20000);
    it.only('getLatest', async () => {
        var _a, e_1, _b, _c;
        const db = new notion_1.ThoughtDB(keys_1.default.notion, notion_1.ThoughtDB.proddbid);
        const latest = db.getLatest(moment_1.default.duration(2, 'month'));
        let i = 0;
        const entries = [];
        try {
            for (var _d = true, latest_1 = __asyncValues(latest), latest_1_1; latest_1_1 = await latest_1.next(), _a = latest_1_1.done, !_a;) {
                _c = latest_1_1.value;
                _d = false;
                try {
                    let l = _c;
                    // console.log(l) //?
                    i++;
                    entries.push(l);
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = latest_1.return)) await _b.call(latest_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const msg = `Here are the entries that were bullet journaled this week,
        provide your thoughts and insights. Direct your responses to ME, the person who wrote the journal entries.
        Do not regurgitate what it says back to me, I already know what it says. Tell me new interesting things.
        Some things to try: rate the ideas on a scale of 1-10, on whatever dimensions seem relevant to you.
        If you have nothing good to add, then don't comment on the entry. If you have multiple interesting things to
        say from multiple perspectives on one entry, then feel free.
            ${entries.map(e => '* ' + e).join('\n')}`;
        const c = new ChatGPT_1.ChatGPT.Client(new openai_1.default({ apiKey: keys_1.default.openai }), `You are a therapist, a philosopher, an organizer, an emotional processor, a second brain,
            and a utility for parsing journal entries. Your job is to summarise insights, provide interesting and
            useful context, make suggestions, and just in general contribute. Not all will be about mental health,
            some will just be about helping a builder build.`);
        // const m = await c.say(msg);
        //
        // console.log(m); //?
    });
});
//# sourceMappingURL=notion.test.js.map