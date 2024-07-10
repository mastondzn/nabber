// Taken from https://github.com/sindresorhus/ky/blob/4886b666ec65aec8e51e59a89d3daf130a24c878/source/errors/HTTPError.ts

export class HTTPError extends Error {
    public response: Response;
    public request: Request;

    constructor(request: Request, response: Response) {
        const code = response.status || response.status === 0 ? response.status : '';
        const title = response.statusText || '';
        const status = `${code} ${title}`.trim();
        const reason = status ? `status code ${status}` : 'an unknown error';

        super(`Request failed with ${reason}: ${request.method} ${request.url}`);

        this.name = 'HTTPError';
        this.response = response;
        this.request = request;
    }
}
