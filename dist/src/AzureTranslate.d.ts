export declare class AzureTranslate {
  private key;
  private endpoint?;
  private location?;

  constructor(key: string, endpoint?: string | undefined, location?: string | undefined);

  translate(text: string, to?: string[], from?: string, traceId?: string): Promise<any>;
}
