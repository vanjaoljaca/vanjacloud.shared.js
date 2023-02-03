// https://developers.notion.com/reference/intro


import {Client} from "@notionhq/client"

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

    async test() {

        let res = await this.notion.databases.query({
            database_id: this.dbid,
        })
        let dbpage = await this.notion.pages.retrieve({
            page_id: res.results[0].id
        });
        console.log('--------')
        console.log(dbpage.object);
        console.log('--------')
        for (const result of res.results) {
            console.log(result.id);
            let props = (result as any).properties;
            console.log(Object.keys(props));
            try {
                console.log(props.Note.title[0].plain_text)
            } catch (e) {
                console.log('*************** BALSAMIC')
                console.log(props.Note)
            }
        }
        console.log('--------')
        return (res.results[0] as any).properties.Note.title[0].plain_text;
    }

    async saveIt(text: string) {

        console.log('saving', text)

        const response = await this.notion.pages.create({
            icon: {
                type: "emoji",
                emoji: "🐿️"
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
}