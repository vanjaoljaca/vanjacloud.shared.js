// fs doesnt work in expo.. sigh
// https://docs.expo.dev/versions/latest/sdk/filesystem/

// readFileSync is runtime, require is at compile time. need to standardise this
// this whole file is so bad pls fix

let values: any;

function loadSettingsFile() {
    if (typeof process !== 'undefined' && process?.versions?.electron == undefined) {
        // no fs in electron, error is annoying
        return null;
    }

    return null;
    // const fs = require('fs');
    // let settingsJson;
    // try {
    //     settingsJson = fs.readFileSync('local.settings.json', 'utf8');
    // } catch (err) {
    //     console.info('Could not load local.settings.json file. Trying ../vanacloud.azurefunc/local.settings.json variables.');
    //     try {
    //         settingsJson = fs.readFileSync('../vanjacloud.azurefunc/local.settings.json', 'utf8');
    //     } catch (err) {
    //         console.info('also bad ../vanacloud.azurefunc/local.settings.json variables.');
    //         return null;
    //     }
    //     const settings = JSON.parse(settingsJson);
    //     return settings.Values;
    // }
}

function loadFromCompileTimeKeys() {
    if (typeof process !== 'undefined' && process?.versions?.electron == undefined) {
        return null;
    }

    return null;
    // try {
    //     return require('../../keys.json');
    // } catch (err) {
    //     console.info('Could not load ../keys.json file.');
    //     return null;
    // }
}

values = loadSettingsFile();
if (values == null) {
    console.info('Could not load settings file. Falling back to ../keys.json variables.');

    values = loadFromCompileTimeKeys();
    if (values == null) {
        console.info('Could not load ../keys.json file. Falling back to env variables.');

        try {
            values = loadFromProcessEnv()
            console.info('Loaded env variables:',
                Object.keys(values).map(k => `${k}: ${values[k]?.length}`));
        } catch (err) {
            console.warn('Could not load any keys variables.');
            values = {
                OPENAI_KEY: undefined,
                NOTION_SECRET: undefined,
                SPOTIFY_CLIENTID: undefined,
                SPOTIFY_CLIENTSECRET: undefined,
                AZURE_TRANSLATE_KEY: undefined,
                HUGGINGFACE_KEY: undefined
            }
        }
    }
}

export default {
    openai: values.OPENAI_KEY,
    notion: values.NOTION_SECRET,
    spotify: {
        clientId: values.SPOTIFY_CLIENTID,
        clientSecret: values.SPOTIFY_CLIENTSECRET
    },
    azure: {
        translate: values.AZURE_TRANSLATE_KEY
    },
    huggingface: values.HUGGINGFACE_KEY
};
function loadFromProcessEnv(): any {
    if (typeof process === 'undefined')
        return null;

    return {
        OPENAI_KEY: process.env.OPENAI_KEY,
        NOTION_SECRET: process.env.NOTION_SECRET,
        SPOTIFY_CLIENTID: process.env.SPOTIFY_CLIENTID,
        SPOTIFY_CLIENTSECRET: process.env.SPOTIFY_CLIENTSECRET,
        AZURE_TRANSLATE_KEY: process.env.AZURE_TRANSLATE_KEY,
        HUGGINGFACE_KEY: process.env.HUGGINGFACE_KEY
    };
}

