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

    const url = new URL('/translate', this.endpoint);
    url.searchParams.append('api-version', '3.0');
    url.searchParams.append('from', 'en');
    url.searchParams.append('to', (opts?.to || defaultTo).join(','));

    const headers = new Headers({
        'Ocp-Apim-Subscription-Key': this.key,
        'Ocp-Apim-Subscription-Region': this.location,
        'Content-Type': 'application/json',
        'X-ClientTraceId': opts?.traceId || this.traceIdGenerator()
    });

    const body = JSON.stringify([{
        'text': text
    }]);

    const response = await fetch(url.toString(), {
        method: 'POST',
        headers: headers,
        body: body
    }).then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    }).catch(e => {
        throw new Error(`/translate error: ${e.message}`);
    });

    return response[0].translations as Translation[];
  }
}