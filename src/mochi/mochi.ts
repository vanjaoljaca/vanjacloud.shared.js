// https://mochi.cards/docs/api/

//https://app.mochi.cards/api/

export class MochiAPI {
  private baseUrl: string = "https://app.mochi.cards/api";

  constructor(private apiKey: string) {

  }

  async listCards(deckId?: string, bookmark?: string, limit?: number) {
    const params = new URLSearchParams();
    if (deckId) params.append("deck-id", deckId);
    if (bookmark) params.append("bookmark", bookmark);
    if (limit) params.append("limit", limit.toString());
    return this.request(`/cards?${params.toString()}`);
  }

  async listDecks() {
    return this.request(`/decks`);
  }

  async addCard(targetDeck: string, card: {
    content: string,
    templateId?: string,
    fields?: object,
    archived?: boolean,
    "review-reverse?"?: boolean,
    pos?: string,
    "manual-tags"?: string[]
  }) {
    const body: any = {
      "content": card.content,
      "deck-id": targetDeck,
      ...(card.templateId && { "template-id": card.templateId }),
      ...(card.fields && { "fields": card.fields }),
      ...(card.archived !== undefined && { "archived?": card.archived }),
      ...(card["review-reverse?"] !== undefined && { "review-reverse?": card["review-reverse?"] }),
      ...(card.pos && { "pos": card.pos }),
      ...(card["manual-tags"] && { "manual-tags": card["manual-tags"] })
    };
    return this.request(`/cards`, "POST", body);
  }


  private async request(endpoint: string, method: string = "GET", body?: any) {
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

// const mochi = new MochiAPI("your_api_key_here");
//
// // list cards; optionally filter by deck-id, bookmark, or limit
// mochi.listCards("my_deck_id").then(console.log).catch(console.error);
//
// // add a card with minimal required fields
// mochi.addCard("my_deck_id", {
//   content: "new card from api"
// }).then(console.log).catch(console.error);