import axios from "axios";
import { throwIfAborted } from "ix/aborterror";
import moment from "moment";

export enum Environment {
  PROD = "https://remote.vanja.oljaca.me:3000",
  DEV = "http://localhost:3000",
}

export interface Translation {
  text: string;
  to: string;
}

interface AzureTranslateOpts {
  endpoint?: string;
  location?: string;
  traceIdGenerator?: () => string;
}

export class VanjaCloudClient {
  private readonly endpoint: Environment;

  constructor(endpoint: Environment) {
    this.endpoint = endpoint;
  }

  async main(api: string, body: any) {
    const response = await this.post(`${this.endpoint}/${api}`, body);
    return response;
  }

  async explain(language: string, text: string) {
    const response = await this.post(`explain`, {
      request: "explain",
      target: language,
      text: text,
      }
    );
    return response;
  }

  async languageRetrospective(language: string, duration?: moment.Duration) {
    console.log("this.url", this.endpoint);
    const response = await this.post(`retrospective`, {
      // target: language,
      prompt: `
                Write a short story in language '${language}' and make it entertaining. It will be used for remembering past translation requests
                in a relevant way. Use all the provided data and make it fun and tie it together in a memorable way. Repetition is allowed if relevant.
                Highlight the supplied references in bold so that they are easily recognizable.`,
      duration,
    });
    return response;
  }

  async retrospective(prompt?: string, duration?: moment.Duration) {
    console.log("this.url", this.endpoint);
    const response = await this.post(`retrospective`, {
      // target: language,
      prompt,
      duration,
    });
    return response;
  }

  async uploadAudio(uri: string) {
    const formData = new FormData();
    formData.append("cv", {
      uri: uri,
      name: "recording.m4a",
      type: "audio/mp3", // todo
    } as any);

    const response = await fetch(`audio`, {
      method: "POST",
      body: formData,
    });

    return response.ok;
  }

  async translate(
    text: string,
    opts?: { to?: string[]; from?: string; traceId?: string },
  ): Promise<Translation[]> {
    const defaultTo = ["en_US", "de", "es", "sr-Cyrl"];

    const request = {
      text: text,
      to: opts?.to || defaultTo,
      from: opts?.from,
      traceId: opts?.traceId,
    };

    const data = await this.post<Translation[]>(`translate`, request);

    return data;
  }

  private async post<T>(api: string, body: any): Promise<T>{
    const headers = this.getDefaultHeaders();

    console.log(`${api}:request`, body, this.endpoint)

    try {
      const response = await axios.post(`${this.endpoint}/${api}`, body, {
        // headers,
      });

      console.log(`${api}:response`, { status: response.status, statusText: response.statusText} , response.data)
      return response.data
    } catch (e) {
      console.error(`${api}:error`, e)
      throw e
    }
  }

  private getDefaultHeaders() {
    return {
        "VanjaCloud_Debug": "true",
      }
  }
}
