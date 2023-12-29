"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentDB = exports.TranslationDB = void 0;
// https://developers.notion.com/reference/intro
const client_1 = require("@notionhq/client");
class TranslationDB {
}
exports.TranslationDB = TranslationDB;
class ContentDB {
    constructor(key, dbid) {
        this.notion = new client_1.Client({
            auth: key
        });
        this.dbid = dbid;
    }
    async save(title, tags, transcript, opts) {
        tags = tags || [];
        console.log('saving', title);
        const response = await this.notion.pages.create({
            // icon: {
            //     type: "emoji",
            //     emoji: categoryEmoji as any
            // },
            parent: {
                type: "database_id",
                database_id: this.dbid
            },
            properties: {
                Name: {
                    title: [
                        {
                            text: {
                                content: title
                            }
                        }
                    ],
                },
                Tags: {
                    multi_select: tags.map(tag => ({ name: tag }))
                },
                Date: {
                    date: {
                        start: ((opts === null || opts === void 0 ? void 0 : opts.date) || new Date()).toISOString()
                    }
                }
            },
            children: [
                {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                        rich_text: [{
                                type: 'text',
                                text: {
                                    content: (opts === null || opts === void 0 ? void 0 : opts.filePath) || 'no file path'
                                }
                            }]
                    }
                },
                {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                        rich_text: [{
                                type: 'text',
                                text: {
                                    content: transcript || 'no transcript'
                                }
                            }]
                    }
                }
            ]
        });
        console.log('saved', response);
        return response;
    }
}
exports.ContentDB = ContentDB;
ContentDB.proddbid = '9a3e2acdc9384157a42c75eb5277cbcb';
ContentDB.testdbid = '4fe8adce320645638c29b11f9c48a54d';
//# sourceMappingURL=ContentDB.js.map