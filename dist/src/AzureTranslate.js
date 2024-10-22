"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureTranslate = void 0;
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
        const url = new URL('/translate', this.endpoint);
        url.searchParams.append('api-version', '3.0');
        url.searchParams.append('from', 'en');
        url.searchParams.append('to', ((opts === null || opts === void 0 ? void 0 : opts.to) || defaultTo).join(','));
        const headers = new Headers({
            'Ocp-Apim-Subscription-Key': this.key,
            'Ocp-Apim-Subscription-Region': this.location,
            'Content-Type': 'application/json',
            'X-ClientTraceId': (opts === null || opts === void 0 ? void 0 : opts.traceId) || this.traceIdGenerator()
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
        return response[0].translations;
    }
}
exports.AzureTranslate = AzureTranslate;
//# sourceMappingURL=AzureTranslate.js.map