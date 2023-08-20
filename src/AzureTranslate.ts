import axios from "axios";

import { v4 as uuidv4 } from "uuid";

export interface Translation {
  text: string;
  to: string;
}

interface AzureTranslateOpts {
  endpoint?: string,
  location?: string,
  traceIdGenerator?: () => string
}

export class AzureTranslate {

  private readonly endpoint: string
  private readonly location: string
  private readonly traceIdGenerator: () => string

  constructor(
    private readonly key: string,
    opts?: AzureTranslateOpts) {

    this.endpoint = opts?.endpoint || "https://api.cognitive.microsofttranslator.com"
    this.location = opts?.location || "westus3"
    this.traceIdGenerator = opts?.traceIdGenerator || uuidv4;
  }

  async translate(text: string, opts?: { to?: string[], from?: string, traceId?: string }): Promise<Translation[]> {

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

    return r.data[0].translations as Translation[];
  }
}