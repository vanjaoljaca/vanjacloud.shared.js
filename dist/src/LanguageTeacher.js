"use strict";
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageTeacher = void 0;
const moment = __importStar(require("moment/moment"));
const ThoughtDB_1 = require("./ThoughtDB");
class LanguageTeacher {
    constructor(chat, db) {
        this.chat = chat;
        this.db = db;
    }
    async retrospective() {
        var _a, e_1, _b, _c;
        const latest = this.db.getLatest(moment.duration(2, 'month'), 10, ThoughtDB_1.ThoughtType.translation);
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
                    entries.push(JSON.parse(l));
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
        const translations = entries.map(e => e.translations.find((t) => t.to == "es").text);
        console.log('got translations', i, entries, translations);
        return this.retrospective2(translations);
    }
    async retrospective2(translations) {
        const language = 'es';
        const msg = `The user has requested the following language translations this week. Create an interesting 
        story or article that can be used by the user to review what was learned this week. Below is a list of the
        requested translations. Important notes:
        1. Write your article in the following target language: ${language}
        2. Make it clear which phrases are being revised by highlighting them in *bold*.
        
        The translation requests are:
            ${translations.map(e => '* ' + e).join('\n')}`;
        const m = await this.chat.say(msg);
        return m;
    }
}
exports.LanguageTeacher = LanguageTeacher;
//# sourceMappingURL=LanguageTeacher.js.map