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

function getValues() {
  values = loadSettingsFile();
  if (values !== null) {
    console.info('vanjacloud:keys:load:settings');
    return values;
  }

  values = loadFromCompileTimeKeys();
  if (values !== null) {
    console.info('vanjacloud:keys:load:compiletime');
    return values;
  }

  try {
    values = loadFromProcessEnv()
    if(values !== null) {
      console.info('vanjacloud:keys:load:env');
      return values;
    }
  } catch (err) {
    console.warn('vanjacloud:keys:load:error');
  }

  values = {}
  return values;
}

values = getValues();

console.log('vanjacloud:keys:load',
  values !== null ? Object.keys(values).map(k => `${k}: ${values[k]?.length}`) : 'null');

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

function loadFromProcessEnv(): any {
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

