// https://developers.notion.com/reference/intro
import { Client } from "@notionhq/client"
import { AsyncIterableX as AsyncIx } from 'ix/asynciterable';
import moment from "moment"
import * as Ix from 'ix';

export class TranslationDB {

}

export enum ThoughtType {
    note = '🐿️',
    translation = '👻'
}

export class NotionDB {

}

export class ThoughtDB {

    static proddbid = '1ccbf2c452d6453d94bc462a8c83c200'
    static testdbid = '4ef4fb0714c9441d94b06c826e74d5d3'

    dbid: string;
    notion: Client;

    constructor(key: string, dbid: string) {
        this.notion = new Client({
            auth: key
        })
        this.dbid = dbid;
    }

    async saveIt(text: string) {

        console.log('saving', text)

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

    async saveIt2(text: string, categoryEmoji?: string, tags?: any[]) {
        tags = tags || [];
        categoryEmoji = categoryEmoji || '🐿️';
        console.log('saving', text)
        const response = await this.notion.pages.create({
            icon: {
                type: "emoji",
                emoji: categoryEmoji as any
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
        return text;
    }

    get(z?: {
        filter?: { type?: ThoughtType, after?: moment.Moment, before?: moment.Moment },
        opts?: { pageSize?: number },
        limit?: number
    }) {
        z = z || {}

        return Ix.AsyncIterable.from(this.getAllRaw(z.filter, z.opts, z.limit))
    }

    async * getAllRaw(filter?: { type?: ThoughtType, after?: moment.Moment, before?: moment.Moment },
        opts?: { pageSize?: number },
        limit?: number) {

        filter = filter || {}
        opts = opts || {}
        const type = filter.type || ThoughtType.note
        const page_size = opts.pageSize || Math.min(limit || 30, 30)

        let count = 0;
        let res: any;

        while ((!limit || count < limit)
            && (res == null || res.has_more)) {
            console.log('notion page')
            res = await this.notion.databases.query({
                database_id: this.dbid,
                start_cursor: res?.next_cursor || undefined,
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
            })

            for (const notionItem of (res.results as any[])) {

                let props = notionItem.properties;
                let data = props.Name || props.Note // (because I made a typo elsewhere...)

                yield {
                    id: notionItem.id,
                    tags: props.Tags == null ? [] : props.Tags.multi_select.map((x: any) => x.name),
                    text: data.title[0].plain_text,
                    type: notionItem.icon?.emoji,
                    date: moment(notionItem.created_time)
                    // date: TODO!!!
                }
                count++;
            }
        }
    }

    // async update(item) {
    //     return this.update(item.id, item);
    // }

    async update(id: string, data: { text?: string, tags?: string[], date?: moment.Moment, type?: ThoughtType }) {

        let props = {} as any

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
            }
        }

        if (data.tags != null) {
            props['Tags'] = {
                multi_select: data.tags.map(tag => ({ name: tag }))
            }
        }

        if (data.date != null) {
            props['Date'] = {
                date: {
                    start: data.date.toISOString()
                }
            }
        }

        const page = {
            page_id: id,
            properties: props
        } as any;


        if (data.type != null) {
            page.icon = {
                type: "emoji",
                emoji: data.type
            }
        }

        const response = await this.notion.pages.update(page);

        return response;
    }

    async * getLatest(duration?: moment.Duration, max?: number, type?: ThoughtType) {

        type = type || ThoughtType.note
        const page_size = 30
        max = max || page_size
        let count = 0;
        let res: any;

        let now = moment();
        let comparisonDate = moment().subtract(duration);

        console.log('comparisonDate', comparisonDate)

        while (count < max && (res == null || res.has_more)) {
            res = await this.notion.databases.query({
                database_id: this.dbid,
                start_cursor: res?.next_cursor || undefined,
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
            })

            console.log('notion res', res.results.length)
            for (const result of (res.results as any[])) {

                let createdTime = moment(result.created_time);
                if (createdTime.isBefore(comparisonDate)) {
                    continue
                }

                if (result.icon == null || result.icon.type != 'emoji' || result.icon.emoji != type) {
                    continue
                }

                let props = result.properties;
                let data = props.Name || props.Note // nfi why...

                yield data.title[0].plain_text
                count++
            }
        }
    }
}


// let dbpage = await this.notion.pages.retrieve({
//     page_id: res.results[0].id
// });
