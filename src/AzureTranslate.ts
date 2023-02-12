import axios from "axios";

import {v4 as uuidv4} from "uuid";

export class AzureTranslate {
  constructor(private key: string,
              private endpoint?: string,
              private location?: string) {
    this.endpoint = endpoint || "https://api.cognitive.microsofttranslator.com"
    this.location = location || "westus3"
  }

  async translate(text: string, to?: string[], from?: string) {

    to = to || ['en', 'de', 'es', 'sr-Cyrl-BA'];

    const r = await axios({
      baseURL: this.endpoint,
      url: '/translate',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': this.key,
        // location required if you're using a multi-service or regional (not global) resource.
        'Ocp-Apim-Subscription-Region': this.location,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
      },
      params: {
        'api-version': '3.0',
        'from': from,
        'to': to
      },
      data: [{
        'text': text
      }],
      responseType: 'json'
    });
    return r.data[0].translations;
  }
}