import type { methods } from './constants';

export type Prettify<T> = { [Key in keyof T]: T[Key] };

export type Parser<TShape = unknown> = (
    input: unknown,
    context: { response: Response; request: Request },
) => TShape | Promise<TShape>;

export type NetterOptions<TShape = unknown> = Prettify<
    {
        throwHttpErrors?: boolean;
        json?: unknown;
        parse?: Parser<TShape>;
    } & RequestInit
>;

export type NetterResponse<TShape = unknown> = Omit<Response, 'json'> & {
    readonly json: <T = TShape>() => Promise<T>;
};

export type NetterPromise<TShape = unknown> = Promise<NetterResponse<TShape>> & {
    readonly json: <T = TShape>() => Promise<T>;
    readonly text: () => Promise<string>;
    readonly blob: () => Promise<Blob>;
};

export type NetterSignature = <TShape = unknown>(
    url: URL | string,
    options?: NetterOptions<TShape>,
) => NetterPromise<TShape>;

export type Netter = NetterSignature & {
    [Method in (typeof methods)[number]]: NetterSignature;
};
