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
        if (opts === null || opts === void 0 ? void 0 : opts.filePath) {
            const existingPage = await this.get(opts === null || opts === void 0 ? void 0 : opts.filePath);
            if (existingPage) {
                throw new Error(`Page with filePath '${opts === null || opts === void 0 ? void 0 : opts.filePath}' already exists.`);
            }
        }
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
                },
                FilePath: {
                    url: (opts === null || opts === void 0 ? void 0 : opts.filePath) || null
                }
            },
            content: ContentDB.createTranscriptBlock(transcript) || []
        });
        console.log('ContentDB.save', response.id);
        return response;
    }
    async update(filePath, opts) {
        console.log('updating', filePath);
        const page = await this.get(filePath);
        if (!page) {
            throw new Error('No record found with the specified filePath');
        }
        const pageId = page.id;
        const properties = {};
        if (opts === null || opts === void 0 ? void 0 : opts.title) {
            properties.Name = {
                title: [
                    {
                        text: {
                            content: opts.title
                        }
                    }
                ]
            };
        }
        if (opts === null || opts === void 0 ? void 0 : opts.tags) {
            properties.Tags = {
                multi_select: opts.tags.map(tag => ({ name: tag }))
            };
        }
        if (opts === null || opts === void 0 ? void 0 : opts.date) {
            properties.Date = {
                date: {
                    start: opts.date.toISOString()
                }
            };
        }
        let children;
        if (opts === null || opts === void 0 ? void 0 : opts.transcript) {
            children = ContentDB.createTranscriptBlock(opts.transcript);
        }
        const updateResponse = await this.notion.pages.update({
            page_id: pageId,
            properties,
        });
        this.notion.pages.update({
            page_id: pageId,
            archived: false,
        });
        const oldBlocks = await this.notion.blocks.children.list({
            block_id: pageId
        });
        if (oldBlocks.results.length > 0) {
            const blockIds = oldBlocks.results.map(block => block.id);
            console.log('archiving', blockIds);
            for (const blockId of blockIds) {
                await this.notion.blocks.update({
                    block_id: blockId,
                    archived: true,
                });
            }
        }
        if (children) {
            console.log('appending', children);
            await this.notion.blocks.children.append({
                block_id: pageId,
                children: children
            });
        }
        console.log('updated', updateResponse);
        return updateResponse;
    }
    async get(filePath) {
        const response = await this.notion.databases.query({
            database_id: this.dbid,
            filter: {
                property: 'FilePath',
                url: {
                    equals: filePath
                }
            }
        });
        console.log('search', filePath, response);
        if (response.results.length > 1) {
            throw new Error(`More than one record found with the specified filePath: ${filePath}`);
        }
        if (response.results.length == 1) {
            return response.results[0];
        }
        return null;
    }
    static createTranscriptBlock(transcript) {
        if (!transcript) {
            return null;
        }
        return [
            {
                object: 'block',
                type: 'paragraph',
                paragraph: {
                    rich_text: [
                        {
                            type: 'text',
                            text: {
                                content: transcript || 'no transcript'
                            }
                        }
                    ]
                }
            }
        ];
    }
}
exports.ContentDB = ContentDB;
ContentDB.proddbid = '9a3e2acdc9384157a42c75eb5277cbcb';
ContentDB.testdbid = '4fe8adce320645638c29b11f9c48a54d';
//# sourceMappingURL=ContentDB.js.map