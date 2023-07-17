import * as moment from "moment/moment";
import { ThoughtDB, ThoughtType } from "./notion";
import { ChatGPT } from "./ChatGPT";
import keys from "../keys";

export class LanguageTeacher {

    constructor(
                private chat: ChatGPT.Client,
                private db?: ThoughtDB, // todo: dont have this in azurefunc
                ) {

    }

    public async retrospective() {

        const latest = this.db!.getLatest(
            moment.duration(2, 'month'),
            10, ThoughtType.translation)

        let i = 0
        const entries = []
        for await (let l of latest) {
            // console.log(l) //?
            i++
            entries.push(JSON.parse(l));

        }

        const translations = entries.map(e => e.translations.find((t: any) => t.to == "es")!.text)

        console.log('got translations', i, translations)
        return this.retrospective2(translations)
    }

    public async retrospective2(translations: string[]) {
        const language = 'es'

        const msg = `The user has requested the following language translations this week. Create an interesting 
        story or article that can be used by the user to review what was learned this week. Below is a list of the
        requested translations. Important notes:
        1. Write your article in the following target language: ${language}
        2. Make it clear which phrases are being revised by highlighting them in *bold*.
        
        The translation requests are:
            ${translations.map(e => '* ' + e).join('\n')}`


        const m = await this.chat.say(msg);

        return m;
    }
}