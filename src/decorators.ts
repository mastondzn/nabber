import type { NetterOptions, NetterPromise, NetterResponse } from './types';

export function decoratePromise<TShape = unknown>(
    promise: Promise<NetterResponse<TShape>>,
): NetterPromise<TShape> {
    return Object.assign(promise, {
        json: async () => await (await promise).json(),
        text: async () => await (await promise).text(),
        blob: async () => await (await promise).blob(),
    }) as NetterPromise<TShape>;
}

export function decorateResponse<TShape = unknown>(
    response: Response,
    request: Request,
    options: NetterOptions<TShape>,
): NetterResponse<TShape> {
    const parsers = {
        // necessary because of the later 'json' access we do to the response
        json: response.json.bind(response),
    };

    return Object.assign(response, {
        json: async () => {
            if ('parse' in options && options.parse) {
                return await options.parse(await parsers.json(), { response, request });
            }
            return await parsers.json();
        },
    }) as NetterResponse<TShape>;
}
