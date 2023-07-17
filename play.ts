// testable-http-triggered-function/__tests__/index.test.ts

// https://developers.notion.com/reference/intro
import keys from './keys';
import { Client } from "@notionhq/client"
import { ChatGPT, ThoughtDB } from "./src";
import * as moment from 'moment'
import { ThoughtType } from "./src/notion";
import { LanguageTeacher } from "./src/LanguageTeacher";

// Initializing a client
const notion = new Client({
    auth: keys.notion
})

async function test() {
    const db = new ThoughtDB(keys.notion, ThoughtDB.proddbid)

    const c = new ChatGPT.Client({
            apiKey: keys.openai,
            systemPrompt:
                `You are a language learning support unit.` // todo move this
        });

    const teacher = new LanguageTeacher(db, c);


    const m = await teacher.retrospective();
    console.log(m); //?
}

test();