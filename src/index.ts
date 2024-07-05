import { methods } from './constants';
import { HTTPError } from './http-error';
import type { NabberOptions } from './options';
import type { TypedResponse } from './types';

async function performFetch(
    url: URL | string,
    { throwHttpErrors, json, parse, ...options }: NabberOptions = {},
) {
    if (json) {
        if (options.body) throw new TypeError('Cannot specify both json and body options');
        if (typeof json !== 'object') throw new TypeError('"json" option must be an object');
        options.body = JSON.stringify(json);
    }

    const request = new Request(url, options);
    const response = await fetch(request);

    if (throwHttpErrors && !response.ok) {
        throw new HTTPError(request, response);
    }

    if (parse) {
        const parseJson = response.json.bind(response);
        return Object.assign(response, {
            json: async () => await parse(await parseJson(), { response, request }),
        });
    }

    return response;
}

function decoratePromise(promise: Promise<Response>) {
    return Object.assign(promise, {
        json: async () => await (await promise).json(),
        text: async () => await (await promise).text(),
        blob: async () => await (await promise).blob(),
        arrayBuffer: async () => await (await promise).arrayBuffer(),
    });
}

export type Nabber = <T = unknown>(
    url: URL | string,
    options?: NabberOptions & {
        parse?: (
            input: unknown,
            context: { response: Response; request: Request },
        ) => T | Promise<T>;
    },
) => Promise<TypedResponse<T>>;

export const nabber = Object.assign(
    (url: URL | string, options?: NabberOptions) => {
        const promise = performFetch(url, options);
        return decoratePromise(promise);
    },
    Object.fromEntries(
        methods.map((method) => [
            method,
            (url: URL | string, options?: NabberOptions) => {
                const promise = performFetch(url, { method: method.toUpperCase(), ...options });
                return decoratePromise(promise);
            },
        ]),
    ),
) as unknown as Nabber & { [Method in (typeof methods)[number]]: Nabber };

export { HTTPError } from './http-error';
export type { NabberOptions } from './options';
export type { TypedResponse } from './types';
