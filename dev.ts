import keys from "./keys";
import { ThoughtDB } from "./src";
import { filter, map, take } from 'ix/asynciterable/operators';
import { ThoughtType } from "./src/ThoughtDB";
import moment from "moment";

function extractHashTags(text: string) {
    const tags = text.match(/#[a-z0-9]+/g)
    return tags || []
}

const db = new ThoughtDB(keys.notion, ThoughtDB.proddbid);

(async function () {

    await groupByHashtag()


    // dev:
    // 4. Create some test data sets for language & notes
    // ios:
    // 5. auto save language translate

})();

async function groupByHashtag() {
    const all = db.get({
        filter: {
            type: ThoughtType.note
        }
    })

    let hashtags: Record<string, number> = {}

    for await (const item of all) {

        if (item.type == ThoughtType.note) {

            let tags = item.tags || []
            tags.forEach((t: string) => {
                hashtags[t] = hashtags[t] || 0
                hashtags[t] = hashtags[t] + 1
            })
        }
    }

    let entries = Object.entries(hashtags)
    entries.sort((a: any, b: any) => b[1] - a[1])
    // let sortedHashtags = Object.fromEntries(entries)
    console.log(entries)
}

async function getWeekSummary() {
    const all = db.get({
        filter: {
            type: ThoughtType.note
        }
    }).take(10);

    let i = 0;
    var week = null as number | null;
    for await (const item of all) {

        let thisWeek = item.date.week();
        if (week != thisWeek) {
            week = thisWeek;
            console.log(`Week #${thisWeek} -----------------`);
        }

        if (item.type == ThoughtType.note) {

            console.log(`[${i++}] ${item.date} ${item.tags}`, item.text);
            console.log();
        }
    }
}

async function backfillHashtags() {

    const all = db.get({
        filter: {
            type: ThoughtType.note
        }
    })

    let i = 0;
    for await (const item of all) {

        var extras;
        switch (item.type) {
            case ThoughtType.note:
                extras = extractHashTags(item.text)
                break;;
            case ThoughtType.translation:
                let p = JSON.parse(item.text);
                extras = ['#translation']
                if (p.preferredLanguage != null) {
                    extras.push(`#translation:${p.preferredLanguage}`)
                }
                break;
            default:
                extras = extractHashTags(item.text)
        }

        var hashTags = new Set<string>(item.tags || []);
        extras.forEach(t => hashTags.add(t))

        console.log(i++, item.text.slice(0, 10), item.date, hashTags);
        await db.update(item.id, {
            tags: Array.from(hashTags),
            date: item.date,
            type: item.type != null ? undefined : ThoughtType.note
        });
    }
}