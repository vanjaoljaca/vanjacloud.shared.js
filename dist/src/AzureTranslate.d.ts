export declare class AzureTranslate {
  private readonly key;
  private readonly endpoint?;
  private readonly location?;

  constructor(key: string, endpoint?: string | undefined, location?: string | undefined);

  translate(text: string, opts?: {
    to?: string[];
    from?: string;
    traceId?: string;
  }): Promise<any>;
}
