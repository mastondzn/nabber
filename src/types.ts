import type { methods } from './constants';

export type Prettify<T> = { [Key in keyof T]: T[Key] };

export type Parser<TOutput = unknown> = (
    input: unknown,
    context: { response: Response; request: Request },
) => TOutput | Promise<TOutput>;

export type NetterOptions<TOutput = unknown> = Prettify<
    {
        throwHttpErrors?: boolean;
        json?: unknown;
        parse?: Parser<TOutput>;
    } & RequestInit
>;

export type NetterResponse<TOutput = unknown> = Omit<Response, 'json'> & {
    readonly json: <T = TOutput>() => Promise<T>;
};

export type NetterPromise<TOutput = unknown> = Promise<NetterResponse<TOutput>> & {
    readonly json: <T = TOutput>() => Promise<T>;
    readonly text: () => Promise<string>;
    readonly blob: () => Promise<Blob>;
};

export type NetterSignature = <TOutput = unknown>(
    url: URL | string,
    options?: NetterOptions<TOutput>,
) => NetterPromise<TOutput>;

export type Netter = NetterSignature & {
    [Method in (typeof methods)[number]]: NetterSignature;
};
