"use strict";
// fs doesnt work in expo.. sigh
// https://docs.expo.dev/versions/latest/sdk/filesystem/
Object.defineProperty(exports, "__esModule", { value: true });
// readFileSync is runtime, require is at compile time. need to standardise this
// this whole file is so bad pls fix
let values;
function loadSettingsFile() {
    var _a;
    if (typeof process !== 'undefined' && ((_a = process === null || process === void 0 ? void 0 : process.versions) === null || _a === void 0 ? void 0 : _a.electron) == undefined) {
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
    var _a;
    if (typeof process !== 'undefined' && ((_a = process === null || process === void 0 ? void 0 : process.versions) === null || _a === void 0 ? void 0 : _a.electron) == undefined) {
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
function getValues() {
    values = loadSettingsFile();
    if (values != null) {
        console.info('vanjacloud:keys:load:settings');
        return values;
    }
    values = loadFromCompileTimeKeys();
    if (values != null) {
        console.info('vanjacloud:keys:load:compiletime');
        return values;
    }
    try {
        values = loadFromProcessEnv();
        console.info('vanjacloud:keys:load:env');
    }
    catch (err) {
        console.warn('vanjacloud:keys:load:error');
        values = {
            OPENAI_KEY: undefined,
            NOTION_SECRET: undefined,
            SPOTIFY_CLIENTID: undefined,
            SPOTIFY_CLIENTSECRET: undefined,
            AZURE_TRANSLATE_KEY: undefined,
            HUGGINGFACE_KEY: undefined,
            MEM_KEY: undefined,
            TWITTER_CONSUMER_API_KEY: undefined,
            TWITTER_CONSUMER_API_KEY_SECRET: undefined,
            TWITTER_API_KEY: undefined,
            TWITTER_API_KEY_SECRET: undefined,
            TWITTER_BEARER_TOKEN: undefined,
            TWITTER_ACCESS_TOKEN: undefined,
            TWITTER_ACCESS_TOKEN_SECRET: undefined,
            TWITTER_OAUTH_TOKEN: undefined,
            TWITTER_OAUTH_TOKEN_SECRET: undefined,
            TWITTER_OAUTH2_CLIENT_ID: undefined,
            TWITTER_OAUTH2_CLIENT_SECRET: undefined
        };
        return values;
    }
}
values = getValues();
console.log('vanjacloud:keys:load', values != null ? Object.keys(values).map(k => { var _a; return `${k}: ${(_a = values[k]) === null || _a === void 0 ? void 0 : _a.length}`; }) : 'null');
exports.default = {
    openai: values.OPENAI_KEY,
    notion: values.NOTION_SECRET,
    spotify: {
        clientId: values.SPOTIFY_CLIENTID,
        clientSecret: values.SPOTIFY_CLIENTSECRET
    },
    azure: {
        translate: values.AZURE_TRANSLATE_KEY
    },
    huggingface: values.HUGGINGFACE_KEY,
    mem: values.MEM_KEY,
    twitter: {
        consumer: {
            apiKey: values.TWITTER_API_KEY,
            apiKeySecret: values.TWITTER_API_KEY_SECRET
        },
        bearerToken: values.TWITTER_BEARER_TOKEN,
        accessToken: values.TWITTER_ACCESS_TOKEN,
        accessTokenSecret: values.TWITTER_ACCESS_TOKEN_SECRET,
        oauthToken: {
            oauth_token: values.TWITTER_OAUTH_TOKEN,
            oauth_token_secret: values.TWITTER_OAUTH_TOKEN_SECRET
        },
        oauth2: {
            clientId: values.TWITTER_OAUTH2_CLIENT_ID,
            clientSecret: values.TWITTER_OAUTH2_CLIENT_SECRET
        }
    }
};
function loadFromProcessEnv() {
    if (typeof process === 'undefined')
        return null;
    return {
        OPENAI_KEY: process.env.OPENAI_KEY,
        NOTION_SECRET: process.env.NOTION_SECRET,
        SPOTIFY_CLIENTID: process.env.SPOTIFY_CLIENTID,
        SPOTIFY_CLIENTSECRET: process.env.SPOTIFY_CLIENTSECRET,
        AZURE_TRANSLATE_KEY: process.env.AZURE_TRANSLATE_KEY,
        HUGGINGFACE_KEY: process.env.HUGGINGFACE_KEY,
        MEM_KEY: process.env.MEM_KEY,
        TWITTER_API_KEY: process.env.TWITTER_API_KEY,
        TWITTER_API_KEY_SECRET: process.env.TWITTER_API_KEY_SECRET,
        TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN,
        TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
        TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET,
        TWITTER_OAUTH_TOKEN: process.env.TWITTER_OAUTH_TOKEN,
        TWITTER_OAUTH_TOKEN_SECRET: process.env.TWITTER_OAUTH_TOKEN_SECRET,
        TWITTER_OAUTH2_CLIENT_ID: process.env.TWITTER_OAUTH2_CLIENT_ID,
        TWITTER_OAUTH2_CLIENT_SECRET: process.env.TWITTER_OAUTH2_CLIENT_SECRET
    };
}
//# sourceMappingURL=keys.js.map