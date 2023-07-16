// https://developers.notion.com/reference/intro
import { Client } from "@notionhq/client"
import moment from "moment"

export class TranslationDB {

}

export enum ThoughtType {
    note = '🐿️',
    translation = '👻'
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

    async* getLatest(duration?: moment.Duration, max?: number, type?: ThoughtType) {

        type = type || ThoughtType.note
        const page_size = 30
        max = max || page_size
        let count = 0;
        let res: any;

        let now = moment();
        let comparisonDate = moment().subtract(duration);

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
            })

            for (const result of (res.results as any[])) {

                let createdTime = moment(result.created_time);
                if (createdTime.isBefore(comparisonDate)) {
                    // 🤷‍ notion doesn't respect filter ...
                    continue
                }

                if (result.icon == null || result.icon.type != 'emoji' || result.icon.emoji != type)
                    continue

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
