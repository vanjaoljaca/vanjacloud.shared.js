import axios from "axios";

import {v4 as uuidv4} from "uuid";

export class AzureTranslate {
  private readonly traceIdGenerator: () => string

  constructor(private readonly key: string,
              private readonly endpoint?: string,
              private readonly location?: string,
              traceIdGenerator?: () => string) {
    this.endpoint = endpoint || "https://api.cognitive.microsofttranslator.com"
    this.location = location || "westus3"
    this.traceIdGenerator = traceIdGenerator || uuidv4;
  }

  async translate(text: string, opts?: { to?: string[], from?: string, traceId?: string }) {

    const defaultTo = ['en', 'de', 'es', 'sr-Cyrl-BA'];

    const r = await axios({
      baseURL: this.endpoint,
      url: '/translate',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': this.key,
        // location required if you're using a multi-service or regional (not global) resource.
        'Ocp-Apim-Subscription-Region': this.location,
        'Content-type': 'application/json',
        'X-ClientTraceId': opts?.traceId || this.traceIdGenerator()
      },
      params: {
        'api-version': '3.0',
        'from': opts?.from, // null is fine
        'to': opts?.to || defaultTo
      },
      data: [{
        'text': text
      }],
      responseType: 'json'
    });
    return r.data[0].translations as { text: string, to: string }[];
  }
}