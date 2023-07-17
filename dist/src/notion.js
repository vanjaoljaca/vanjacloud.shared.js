"use strict";
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThoughtDB = exports.ThoughtType = exports.TranslationDB = void 0;
// https://developers.notion.com/reference/intro
const client_1 = require("@notionhq/client");
const moment_1 = __importDefault(require("moment"));
class TranslationDB {
}
exports.TranslationDB = TranslationDB;
var ThoughtType;
(function (ThoughtType) {
    ThoughtType["note"] = "\uD83D\uDC3F\uFE0F";
    ThoughtType["translation"] = "\uD83D\uDC7B";
})(ThoughtType || (exports.ThoughtType = ThoughtType = {}));
class ThoughtDB {
    constructor(key, dbid) {
        this.notion = new client_1.Client({
            auth: key
        });
        this.dbid = dbid;
    }
    async saveIt(text) {
        console.log('saving', text);
        const response = await this.notion.pages.create({
            icon: {
                type: "emoji",
                emoji: ThoughtType.note
            },
            parent: {
                type: "database_id",
                database_id: this.dbid
            },
            properties: {
                title: [
                    {
                        text: {
                            content: text
                        }
                    }
                ]
            }
        });
        return text;
    }
    getLatest(duration, max, type) {
        return __asyncGenerator(this, arguments, function* getLatest_1() {
            type = type || ThoughtType.note;
            const page_size = 30;
            max = max || page_size;
            let count = 0;
            let res;
            let now = (0, moment_1.default)();
            let comparisonDate = (0, moment_1.default)().subtract(duration);
            while (count < max && (res == null || res.has_more)) {
                res = yield __await(this.notion.databases.query({
                    database_id: this.dbid,
                    start_cursor: (res === null || res === void 0 ? void 0 : res.next_cursor) || undefined,
                    page_size,
                    sorts: [
                        {
                            timestamp: 'created_time',
                            direction: 'descending'
                        }
                    ],
                    filter: {
                        // "and": [
                        //     {
                        "timestamp": "created_time",
                        "created_time": {
                            "after": comparisonDate.toISOString(),
                            "before": now.toISOString()
                        },
                        // },
                        // todo: can't filter by icon, need to move icon into properties...
                        // {
                        //     "property": "icon",
                        //     "title": {
                        //         "equals": "John"
                        //     }
                        // }
                        // ]
                    }
                }));
                for (const result of res.results) {
                    let createdTime = (0, moment_1.default)(result.created_time);
                    if (createdTime.isBefore(comparisonDate)) {
                        // 🤷‍ notion doesn't respect filter ...
                        continue;
                    }
                    if (result.icon == null || result.icon.type != 'emoji' || result.icon.emoji != type)
                        continue;
                    let props = result.properties;
                    let data = props.Name || props.Note; // nfi why...
                    yield yield __await(data.title[0].plain_text);
                    count++;
                }
            }
        });
    }
}
exports.ThoughtDB = ThoughtDB;
ThoughtDB.proddbid = '1ccbf2c452d6453d94bc462a8c83c200';
ThoughtDB.testdbid = '4ef4fb0714c9441d94b06c826e74d5d3';
// let dbpage = await this.notion.pages.retrieve({
//     page_id: res.results[0].id
// });
//# sourceMappingURL=notion.js.map