export class HTTPError extends Error {
    request: Request;
    response: Response;
    constructor(request: Request, response: Response) {
        super(
            `HTTP Error ${response.status}: ${response.statusText} (${request.method} ${request.url})`,
        );

        this.name = 'HTTPError';
        this.response = response;
        this.request = request;
    }
}
