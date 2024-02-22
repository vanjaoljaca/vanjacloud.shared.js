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
const ThoughtDB_1 = require("./ThoughtDB");
const keys_1 = __importDefault(require("../keys"));
const moment_1 = __importDefault(require("moment"));
const ChatGPT_1 = require("./ChatGPT");
describe('notion', () => {
    jest.setTimeout(20000);
    it.only('getLatest.Translation', async () => {
        var _a, e_1, _b, _c;
        const db = new ThoughtDB_1.ThoughtDB(keys_1.default.notion, ThoughtDB_1.ThoughtDB.proddbid);
        const latest = db.getLatest(moment_1.default.duration(2, 'month'), 10, ThoughtDB_1.ThoughtType.translation);
        let i = 0;
        const entries = [];
        try {
            for (var _d = true, latest_1 = __asyncValues(latest), latest_1_1; latest_1_1 = await latest_1.next(), _a = latest_1_1.done, !_a; _d = true) {
                _c = latest_1_1.value;
                _d = false;
                let l = _c;
                // console.log(l) //?
                i++;
                entries.push(l);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = latest_1.return)) await _b.call(latest_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const language = 'es';
        const msg = `The user has requested the following language translations this week. Create an interesting 
        story or article that can be used by the user to review what was learned this week. Below is a list of the
        requested translations. Important notes:
        1. Write your article in the following target language: ${language}
        2. Make it clear which phrases are being revised.
        
        The translation requests are:
            ${entries.map(e => '* ' + e).join('\n')}`;
        const c = new ChatGPT_1.ChatGPT.Client({
            apiKey: keys_1.default.openai,
            systemPrompt: `You are a language learning support unit.`
        });
        const m = await c.say(msg);
        console.log(entries, m); //?
    });
    it('getLatest.Note', async () => {
        var _a, e_2, _b, _c;
        const db = new ThoughtDB_1.ThoughtDB(keys_1.default.notion, ThoughtDB_1.ThoughtDB.proddbid);
        const latest = db.getLatest(moment_1.default.duration(2, 'month'));
        let i = 0;
        const entries = [];
        try {
            for (var _d = true, latest_2 = __asyncValues(latest), latest_2_1; latest_2_1 = await latest_2.next(), _a = latest_2_1.done, !_a; _d = true) {
                _c = latest_2_1.value;
                _d = false;
                let l = _c;
                // console.log(l) //?
                i++;
                entries.push(l);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = latest_2.return)) await _b.call(latest_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        const msg = `Here are the entries that were bullet journaled this week,
        provide your thoughts and insights. Direct your responses to ME, the person who wrote the journal entries.
        Do not regurgitate what it says back to me, I already know what it says. Tell me new interesting things.
        Some things to try: rate the ideas on a scale of 1-10, on whatever dimensions seem relevant to you.
        If you have nothing good to add, then don't comment on the entry. If you have multiple interesting things to
        say from multiple perspectives on one entry, then feel free.
            ${entries.map(e => '* ' + e).join('\n')}`;
        const c = new ChatGPT_1.ChatGPT.Client({
            apiKey: keys_1.default.openai,
            systemPrompt: `You are a therapist, a philosopher, an organizer, an emotional processor, a second brain,
            and a utility for parsing journal entries. Your job is to summarise insights, provide interesting and
            useful context, make suggestions, and just in general contribute. Not all will be about mental health,
            some will just be about helping a builder build.`
        });
        // const m = await c.say(msg);
        //
        // console.log(m); //?
    });
    it.only('getLatest.Note', async () => {
        const db = new ThoughtDB_1.ThoughtDB(keys_1.default.notion, ThoughtDB_1.ThoughtDB.proddbid);
        const all = await db.getAll({ limit: 10 }); //?
        let i = 0;
        const entries = [];
        // for await (let l of all) {
        //     // console.log(l) //?
        //     i++
        //     entries.push(l);
        // }
    });
});
//# sourceMappingURL=ThoughtDB.test.js.map