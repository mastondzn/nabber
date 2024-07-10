import { HttpResponse, type RequestHandler, http } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll } from 'vitest';

const json = HttpResponse.json.bind(HttpResponse);
const text = HttpResponse.text.bind(HttpResponse);

export const handlers: RequestHandler[] = [
    http.get('https://example.com/error', () => json({ error: 'Not Found' }, { status: 404 })),
    http.get('https://example.com/json', () => json({ data: 'foo' })),
    http.get('https://example.com/text', () => text('foo')),
    http.all('https://example.com/method', ({ request }) => text(request.method)),
    http.get('https://example.com/one-second', async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return json({ data: 'foo' });
    }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
