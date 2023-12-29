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
        console.log('saving', title)
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
                                content: opts?.filePath || 'no file path'
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
        console.log('saved', response)
        return response;
    }
}
