"use strict";
// https://mochi.cards/docs/api/
Object.defineProperty(exports, "__esModule", { value: true });
exports.MochiAPI = void 0;
//https://app.mochi.cards/api/
class MochiAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = "https://app.mochi.cards/api";
    }
    async listCards(deckId, bookmark, limit) {
        const params = new URLSearchParams();
        if (deckId)
            params.append("deck-id", deckId);
        if (bookmark)
            params.append("bookmark", bookmark);
        if (limit)
            params.append("limit", limit.toString());
        return this.request(`/cards?${params.toString()}`);
    }
    async listDecks() {
        return this.request(`/decks`);
    }
    async addCard(targetDeck, card) {
        const body = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ "content": card.content, "deck-id": targetDeck }, (card.templateId && { "template-id": card.templateId })), (card.fields && { "fields": card.fields })), (card.archived !== undefined && { "archived?": card.archived })), (card["review-reverse?"] !== undefined && { "review-reverse?": card["review-reverse?"] })), (card.pos && { "pos": card.pos })), (card["manual-tags"] && { "manual-tags": card["manual-tags"] }));
        return this.request(`/cards`, "POST", body);
    }
    async request(endpoint, method = "GET", body) {
        const headers = {
            "content-type": "application/json",
            "authorization": `basic ${btoa(this.apiKey + ':')}`
        };
        const url = `${this.baseUrl}${endpoint}`;
        const res = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        });
        if (!res.ok) {
            const err = await res.text();
            throw new Error(`mochi api error: ${res.status} ${err}`);
        }
        return res.json();
    }
}
exports.MochiAPI = MochiAPI;
// const mochi = new MochiAPI("your_api_key_here");
//
// // list cards; optionally filter by deck-id, bookmark, or limit
// mochi.listCards("my_deck_id").then(console.log).catch(console.error);
//
// // add a card with minimal required fields
// mochi.addCard("my_deck_id", {
//   content: "new card from api"
// }).then(console.log).catch(console.error);
//# sourceMappingURL=mochi.js.map