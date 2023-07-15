// testable-http-triggered-function/__tests__/index.test.ts

import { ThoughtDB } from "./notion";
import keys from '../keys'
import moment from 'moment'
import { ChatGPT } from "./ChatGPT";
import OpenAI from "openai";

describe('notion', () => {
    jest.setTimeout(20000)
    it.only('getLatest', async () => {
        const db = new ThoughtDB(keys.notion, ThoughtDB.proddbid)

        const latest =  db.getLatest(moment.duration(2, 'month'))
        let i = 0
        const entries = []
        for await (let l of latest) {
            // console.log(l) //?
            i++
            entries.push(l);
        }

        const msg = `Here are the entries that were bullet journaled this week,
        provide your thoughts and insights. Direct your responses to ME, the person who wrote the journal entries.
        Do not regurgitate what it says back to me, I already know what it says. Tell me new interesting things.
        Some things to try: rate the ideas on a scale of 1-10, on whatever dimensions seem relevant to you.
        If you have nothing good to add, then don't comment on the entry. If you have multiple interesting things to
        say from multiple perspectives on one entry, then feel free.
            ${entries.map(e => '* ' + e).join('\n')}`

        const c = new ChatGPT.Client(new OpenAI({ apiKey: keys.openai }),
            `You are a therapist, a philosopher, an organizer, an emotional processor, a second brain,
            and a utility for parsing journal entries. Your job is to summarise insights, provide interesting and
            useful context, make suggestions, and just in general contribute. Not all will be about mental health,
            some will just be about helping a builder build.`);
        // const m = await c.say(msg);
        //
        // console.log(m); //?
    })
})