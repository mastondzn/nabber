import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { ZodError, z } from 'zod';

import { HTTPError, type NetterResponse, netter } from '../src';

describe('netter', () => {
    it('should be compatible with fetch-like calling', async () => {
        const response = await netter('https://example.com/json');
        const data = await response.json();
        expect(data).toEqual({ data: 'foo' });

        const error = await netter('https://example.com/error');
        expect(error.status).toBe(404);
        expect(await error.json()).toEqual({ error: 'Not Found' });
    });

    it('should work with decorated .json() method on promise', async () => {
        const data = await netter('https://example.com/json').json();
        expect(data).toEqual({ data: 'foo' });
    });

    it('should work with decorated .text() method on promise', async () => {
        const data = await netter('https://example.com/text').text();
        expect(data).toBe('foo');
    });

    it('should work with decorated .blob() method on promise', async () => {
        const blob = await netter('https://example.com/text').blob();
        expect(blob).toBeInstanceOf(Blob);
        const asText = await blob.text();
        expect(asText).toBe('foo');
    });

    it('should work with .method properties', async () => {
        // the server returns the request method as the response body
        const post = await netter.post('https://example.com/method');
        expect(await post.text()).toBe('POST');

        const put = await netter.put('https://example.com/method');
        expect(await put.text()).toBe('PUT');

        const delet = await netter.delete('https://example.com/method');
        expect(await delet.text()).toBe('DELETE');
    });

    it('should work with parse option', async () => {
        const schema = z.object({ data: z.string() });
        const parser = vi.fn((input: unknown) => schema.parse(input));

        const response = await netter.get('https://example.com/json', { parse: parser }).json();

        expect(parser).toHaveBeenCalledOnce();
        expect(response).toEqual({ data: 'foo' });
        expectTypeOf(response).toMatchTypeOf<{ data: string }>();

        await expect(
            netter('https://example.com/json', {
                parse: (data) => z.string().parse(data),
            }).json(),
        ).rejects.toBeInstanceOf(ZodError);
    });

    it('should only parse when parsing the json', async () => {
        const schema = z.object({ data: z.string() });
        const parser = vi.fn((input: unknown) => schema.parse(input));

        const response = await netter.get('https://example.com/json', { parse: parser });
        expect(parser).not.toHaveBeenCalled();

        const json = await response.json();
        expect(parser).toHaveBeenCalledOnce();

        expect(json).toEqual({ data: 'foo' });
        expectTypeOf(json).toMatchTypeOf<{ data: string }>();
    });

    it('should work with parse option and the context', async () => {
        const schemas = {
            data: z.object({ data: z.string() }),
            error: z.object({ error: z.string() }),
        };

        const data = await netter('https://example.com/json', {
            parse: (input, { response, request }) => {
                expect(response).toBeInstanceOf(Response);
                expect(request).toBeInstanceOf(Request);
                expect(request.url).toBe('https://example.com/json');

                if (!response.ok) {
                    return schemas.error.parse(input);
                }
                return schemas.data.parse(input);
            },
        }).json();

        expect(data).toEqual({ data: 'foo' });
        expectTypeOf(data).toMatchTypeOf<{ data: string } | { error: string }>();
    });

    it('should throw https errors', async () => {
        try {
            await netter('https://example.com/error', { throwHttpErrors: true });
            expect(false).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(HTTPError);
            expect((error as HTTPError).response.status).toBe(404);
        }
    });

    it('should work with generic type', async () => {
        const one = await netter.get<{ data: string }>('https://example.com/json');
        const two = await netter('https://example.com/json');

        expectTypeOf(one).toMatchTypeOf<NetterResponse<{ data: string }>>();
        expectTypeOf(two).toEqualTypeOf<NetterResponse>();
    });
});
