"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureTranslate = void 0;
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
class AzureTranslate {
    constructor(key, opts) {
        this.key = key;
        this.endpoint = (opts === null || opts === void 0 ? void 0 : opts.endpoint) || "https://api.cognitive.microsofttranslator.com";
        this.location = (opts === null || opts === void 0 ? void 0 : opts.location) || "westus3";
        this.traceIdGenerator = (opts === null || opts === void 0 ? void 0 : opts.traceIdGenerator) || uuid_1.v4;
    }
    async translate(text, opts) {
        const defaultTo = ['en', 'de', 'es', 'sr-Cyrl-BA'];
        const r = await (0, axios_1.default)({
            baseURL: this.endpoint,
            url: '/translate',
            method: 'post',
            headers: {
                'Ocp-Apim-Subscription-Key': this.key,
                // location required if you're using a multi-service or regional (not global) resource.
                'Ocp-Apim-Subscription-Region': this.location,
                'Content-type': 'application/json',
                'X-ClientTraceId': (opts === null || opts === void 0 ? void 0 : opts.traceId) || this.traceIdGenerator()
            },
            params: {
                'api-version': '3.0',
                'from': opts === null || opts === void 0 ? void 0 : opts.from,
                'to': (opts === null || opts === void 0 ? void 0 : opts.to) || defaultTo
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