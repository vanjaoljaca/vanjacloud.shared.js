"use strict";
// https://developers.notion.com/reference/intro
Object.defineProperty(exports, "__esModule", {value: true});
exports.ThoughtDB = void 0;
const client_1 = require("@notionhq/client");

class ThoughtDB {
  constructor(key, dbid) {
    this.notion = new client_1.Client({
      auth: key
    });
    this.dbid = dbid;
  }

  async test() {
    let res = await this.notion.databases.query({
      database_id: this.dbid,
    });
    let dbpage = await this.notion.pages.retrieve({
      page_id: res.results[0].id
    });
    console.log('--------');
    console.log(dbpage.object);
    console.log('--------');
    for (const result of res.results) {
      console.log(result.id);
      let props = result.properties;
      console.log(Object.keys(props));
      try {
        console.log(props.Note.title[0].plain_text);
      } catch (e) {
        console.log('*************** BALSAMIC');
        console.log(props.Note);
      }
    }
    console.log('--------');
    return res.results[0].properties.Note.title[0].plain_text;
  }

  async saveIt(text) {
    console.log('saving', text);
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

exports.ThoughtDB = ThoughtDB;
ThoughtDB.proddbid = '1ccbf2c452d6453d94bc462a8c83c200';
ThoughtDB.testdbid = '4ef4fb0714c9441d94b06c826e74d5d3';
//# sourceMappingURL=notion.js.map