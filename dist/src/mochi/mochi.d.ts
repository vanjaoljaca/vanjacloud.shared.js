export declare class MochiAPI {
    private apiKey;
    private baseUrl;
    constructor(apiKey: string);
    listCards(deckId?: string, bookmark?: string, limit?: number): Promise<any>;
    listDecks(): Promise<any>;
    addCard(targetDeck: string, card: {
        content: string;
        templateId?: string;
        fields?: object;
        archived?: boolean;
        "review-reverse?"?: boolean;
        pos?: string;
        "manual-tags"?: string[];
    }): Promise<any>;
    private request;
}
//# sourceMappingURL=mochi.d.ts.map