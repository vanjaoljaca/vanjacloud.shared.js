"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.AzureTranslate = void 0;
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");

class AzureTranslate {
  constructor(key, endpoint, location) {
    this.key = key;
    this.endpoint = endpoint;
    this.location = location;
    this.endpoint = endpoint || "https://api.cognitive.microsofttranslator.com";
    this.location = location || "westus3";
  }

  async translate(text, to, from) {
    to = to || ['en', 'de', 'es', 'sr-Cyrl-BA'];
    const r = await (0, axios_1.default)({
      baseURL: this.endpoint,
      url: '/translate',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': this.key,
        // location required if you're using a multi-service or regional (not global) resource.
        'Ocp-Apim-Subscription-Region': this.location,
        'Content-type': 'application/json',
        'X-ClientTraceId': (0, uuid_1.v4)().toString()
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
exports.AzureTranslate = AzureTranslate;
//# sourceMappingURL=AzureTranslate.js.map