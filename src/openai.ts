import {Configuration, OpenAIApi} from "openai";
import keys from "../keys";
import fs from "fs";
import path from "path";


const configuration = new Configuration({
    apiKey: keys.openai,
});
const openai = new OpenAIApi(configuration);

async function withLocalCache<T>(filename: string, fn: () => Promise<any>): Promise<T> {
    if (fs.existsSync(filename)) {
        return JSON.parse(fs.readFileSync(filename, 'utf-8'));
    }

    if (process.env.GITHUB_ACTION) {
        throw new Error('Remote interaction disabled for CI tests. Check in snapshots instead.')
    }

    const result = await fn();
    const unwrapped = {
        data: result.data,
        status: result.status,
        statusText: result.statusText,
        headers: result.headers,
        config: result.config
    }

    fs.writeFileSync(filename, JSON.stringify(unwrapped))

    return result;
}

export async function getOrCreateCompletion(version: number, prompt: string) {
    const promptHash = Buffer.from(prompt).toString('base64')
    const destfolder = path.join('./testdata/openai/', version.toString())
    const filename = path.join(destfolder, 'response.' + promptHash + '.json')

    return withLocalCache(filename, () =>
        openai.createCompletion({
            model: "text-davinci-00" + version,
            prompt: prompt,
        })
    );
}
