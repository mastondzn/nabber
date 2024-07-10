import { methods } from './constants';
import { decoratePromise, decorateResponse } from './decorators';
import { fromEntries } from './from-entries';
import { HTTPError } from './http-error';
import type { Netter, NetterOptions, NetterResponse, NetterSignature } from './types';

async function performFetch(url: URL | string, options: NetterOptions): Promise<NetterResponse> {
    if (options.json) {
        if (options.body) {
            throw new TypeError('Cannot specify both json and body options');
        }
        options.body = JSON.stringify(options.json);
    }

    const request = new Request(url, options);
    const response = await fetch(request);

    if (options.throwHttpErrors && !response.ok) {
        throw new HTTPError(request, response);
    }

    return decorateResponse(response, request, options);
}

export function createNetter(method?: (typeof methods)[number]): NetterSignature {
    return (url, options = {}) => {
        options = Object.assign(options, { method: options.method ?? method });
        const promise = performFetch(url, options);
        return decoratePromise(promise);
    };
}

const netter: Netter = Object.assign(
    createNetter(),
    fromEntries(methods.map((method) => [method, createNetter(method)])),
);

export { netter, netter as net };
export { HTTPError } from './http-error';
export type { NetterResponse, NetterOptions, NetterPromise, NetterSignature } from './types';
export { methods } from './constants';
