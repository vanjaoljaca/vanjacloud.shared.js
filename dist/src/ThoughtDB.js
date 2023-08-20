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
exports.ThoughtDB = exports.NotionDB = exports.ThoughtType = exports.TranslationDB = void 0;
// https://developers.notion.com/reference/intro
const client_1 = require("@notionhq/client");
const moment_1 = __importDefault(require("moment"));
const Ix = __importStar(require("ix"));
class TranslationDB {
}
exports.TranslationDB = TranslationDB;
var ThoughtType;
(function (ThoughtType) {
    ThoughtType["note"] = "\uD83D\uDC3F\uFE0F";
    ThoughtType["translation"] = "\uD83D\uDC7B";
})(ThoughtType || (exports.ThoughtType = ThoughtType = {}));
class NotionDB {
}
exports.NotionDB = NotionDB;
class ThoughtDB {
    constructor(key, dbid) {
        this.notion = new client_1.Client({
            auth: key
        });
        this.dbid = dbid;
    }
    async saveTranslation(translations, preferredLanguage) {
        preferredLanguage = preferredLanguage || 'unknown';
        const r = await this.saveIt2(JSON.stringify({ translations, preferredLanguage }), ThoughtType.translation, ['#translation', `#translation:${preferredLanguage}`]);
        return r;
    }
    async saveIt2(text, categoryEmoji, tags) {
        tags = tags || [];
        categoryEmoji = categoryEmoji || '🐿️';
        console.log('saving', text);
        const response = await this.notion.pages.create({
            icon: {
                type: "emoji",
                emoji: categoryEmoji
            },
            parent: {
                type: "database_id",
                database_id: this.dbid
            },
            properties: {
                Name: {
                    title: [
                        {
                            text: {
                                content: text
                            }
                        }
                    ],
                },
                Tags: {
                    multi_select: tags.map(tag => ({ name: tag }))
                },
                Date: {
                    date: {
                        start: new Date().toISOString()
                    }
                }
            }
        });
        return response;
    }
    get(z) {
        z = z || {};
        return Ix.AsyncIterable.from(this.getAllRaw(z.filter, z.opts, z.limit));
    }
    getAllRaw(filter, opts, limit) {
        var _a;
        return __asyncGenerator(this, arguments, function* getAllRaw_1() {
            filter = filter || {};
            opts = opts || {};
            const type = filter.type || ThoughtType.note;
            const page_size = opts.pageSize || Math.min(limit || 30, 30);
            let count = 0;
            let res;
            while ((!limit || count < limit)
                && (res == null || res.has_more)) {
                console.log('notion page');
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
                    // filter: {
                    // "and": [
                    //     {
                    // "timestamp": "created_time",
                    // "created_time": {
                    //     "after": filter.after.toISOString()
                    //     // only 1 filter can go here
                    // },
                    // },
                    // todo: can't filter by icon, need to move icon into properties...
                    // {
                    //     "property": "icon",
                    //     "title": {
                    //         "equals": "John"
                    //     }
                    // }
                    // ]
                    // }
                }));
                for (const notionItem of res.results) {
                    let props = notionItem.properties;
                    let data = props.Name || props.Note; // (because I made a typo elsewhere...)
                    yield yield __await({
                        id: notionItem.id,
                        tags: props.Tags == null ? [] : props.Tags.multi_select.map((x) => x.name),
                        text: data.title[0].plain_text,
                        type: (_a = notionItem.icon) === null || _a === void 0 ? void 0 : _a.emoji,
                        date: (0, moment_1.default)(notionItem.created_time)
                        // date: TODO!!!
                    });
                    count++;
                }
            }
        });
    }
    // async update(item) {
    //     return this.update(item.id, item);
    // }
    async update(id, data) {
        let props = {};
        if (data.text != null) {
            props['Name'] = {
                title: {
                    title: [
                        {
                            text: {
                                content: data.text
                            }
                        }
                    ],
                }
            };
        }
        if (data.tags != null) {
            props['Tags'] = {
                multi_select: data.tags.map(tag => ({ name: tag }))
            };
        }
        if (data.date != null) {
            props['Date'] = {
                date: {
                    start: data.date.toISOString()
                }
            };
        }
        const page = {
            page_id: id,
            properties: props
        };
        if (data.type != null) {
            page.icon = {
                type: "emoji",
                emoji: data.type
            };
        }
        const response = await this.notion.pages.update(page);
        return response;
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
            console.log('comparisonDate', comparisonDate);
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
                            "after": comparisonDate.toISOString()
                            // only 1 filter can go here
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
                console.log('notion res', res.results.length);
                for (const result of res.results) {
                    let createdTime = (0, moment_1.default)(result.created_time);
                    if (createdTime.isBefore(comparisonDate)) {
                        continue;
                    }
                    if (result.icon == null || result.icon.type != 'emoji' || result.icon.emoji != type) {
                        continue;
                    }
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
ThoughtDB.ThoughtType = ThoughtType;
ThoughtDB.proddbid = '1ccbf2c452d6453d94bc462a8c83c200';
ThoughtDB.testdbid = '4ef4fb0714c9441d94b06c826e74d5d3';
// let dbpage = await this.notion.pages.retrieve({
//     page_id: res.results[0].id
// });
//# sourceMappingURL=ThoughtDB.js.map