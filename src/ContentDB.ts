// https://developers.notion.com/reference/intro
import { Client } from "@notionhq/client"
import moment, { Moment } from "moment"
import * as Ix from 'ix';

export class TranslationDB {

}

export class ContentDB {

    static proddbid = '9a3e2acdc9384157a42c75eb5277cbcb'
    static testdbid = '4fe8adce320645638c29b11f9c48a54d'

    dbid: string;
    notion: Client; // todo: use NotionDB instead of notion client

    constructor(key: string, dbid: string) {
        this.notion = new Client({
            auth: key
        })
        this.dbid = dbid;
    }

    async save(title: string, tags?: string[], transcript?: string, opts?: {
        filePath?: string,
        date: Moment
    }) {
        tags = tags || [];
        console.log('saving', title);

        if (opts?.filePath) {
            const existingPage = await this.get(opts?.filePath);
            if (existingPage) {
                throw new Error(`Page with filePath '${opts?.filePath}' already exists.`);
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
                        start: (opts?.date || new Date()).toISOString()
                    }
                },
                FilePath: {
                    url: opts?.filePath || null
                }
            },
            content: ContentDB.createTranscriptBlock(transcript) as any || []
        });
        console.log('ContentDB.save', response.id)
        return response;
    }


    async update(filePath: string, opts?: {
        title?: string,
        tags?: string[],
        transcript?: string,
        date?: Moment
    }) {
        console.log('updating', filePath);

        const page = await this.get(filePath);

        if (!page) {
            throw new Error('No record found with the specified filePath');
        }

        const pageId = page.id;

        const properties: any = {};

        if (opts?.title) {
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

        if (opts?.tags) {
            properties.Tags = {
                multi_select: opts.tags.map(tag => ({ name: tag }))
            };
        }

        if (opts?.date) {
            properties.Date = {
                date: {
                    start: opts.date.toISOString()
                }
            };
        }

        let children;
        if (opts?.transcript) {
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
                children: children as any
            });
        }
        console.log('updated', updateResponse);
        return updateResponse;
    }

    async get(filePath: string) {
        const response = await this.notion.databases.query({
            database_id: this.dbid,
            filter: {
                property: 'FilePath',
                url: {
                    equals: filePath
                }
            }
        });

        console.log('search', filePath, response)

        if (response.results.length > 1) {
            throw new Error(`More than one record found with the specified filePath: ${filePath}`);
        }

        if (response.results.length == 1) {
            return response.results[0];
        }

        return null;
    }

    private static createTranscriptBlock(transcript?: string) {
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
        ]
    }
}
