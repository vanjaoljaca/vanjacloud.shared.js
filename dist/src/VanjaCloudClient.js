"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VanjaCloudClient = exports.Environment = void 0;
const axios_1 = __importDefault(require("axios"));
var Environment;
(function (Environment) {
    Environment["PROD"] = "https://remote.vanja.oljaca.me:3000";
    Environment["DEV"] = "http://localhost:3000";
})(Environment || (exports.Environment = Environment = {}));
class VanjaCloudClient {
    constructor(endpoint) {
        this.endpoint = endpoint;
    }
    async main(api, body) {
        const response = await this.post(`${this.endpoint}/${api}`, body);
        return response.data;
    }
    async explain(language, text) {
        const response = await this.post(`explain`, {
            request: "explain",
            target: language,
            text: text,
        });
        return response.data;
    }
    async languageRetrospective(language, duration) {
        console.log("this.url", this.endpoint);
        const response = await this.post(`retrospective`, {
            // target: language,
            prompt: `
                Write a short story in language '${language}' and make it entertaining. It will be used for remembering past translation requests
                in a relevant way. Use all the provided data and make it fun and tie it together in a memorable way. Repetition is allowed if relevant.
                Highlight the supplied references in bold so that they are easily recognizable.`,
            duration,
        });
        return response.data;
    }
    async retrospective(prompt, duration) {
        console.log("this.url", this.endpoint);
        const response = await this.post(`retrospective`, {
            // target: language,
            prompt,
            duration,
        });
        return response.data;
    }
    async uploadAudio(uri) {
        const formData = new FormData();
        formData.append("cv", {
            uri: uri,
            name: "recording.m4a",
            type: "audio/mp3", // todo
        });
        const response = await fetch(`audio`, {
            method: "POST",
            body: formData,
        });
        return response.ok;
    }
    async translate(text, opts) {
        const defaultTo = ["en_US", "de", "es", "sr-Cyrl"];
        const request = {
            text: text,
            to: (opts === null || opts === void 0 ? void 0 : opts.to) || defaultTo,
            from: opts === null || opts === void 0 ? void 0 : opts.from,
            traceId: opts === null || opts === void 0 ? void 0 : opts.traceId,
        };
        const response = await this.post(`translate`, request);
        return response.data;
    }
    async post(api, body) {
        const headers = this.getDefaultHeaders();
        console.trace('post no h', `${this.endpoint}/${api}`, body, headers);
        return axios_1.default.post(`${this.endpoint}/${api}`, body, {
        // headers,
        });
    }
    getDefaultHeaders() {
        return {
            "VanjaCloud_Debug": "true",
        };
    }
}
exports.VanjaCloudClient = VanjaCloudClient;
//# sourceMappingURL=VanjaCloudClient.js.map