import type { Prettify } from './types';

export interface NabberExtraOptions {
    throwHttpErrors?: boolean;
    json?: unknown;
    parse?: (input: unknown, context: { response: Response; request: Request }) => unknown;
}

export type NabberOptions = Prettify<NabberExtraOptions & RequestInit>;
