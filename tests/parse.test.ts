import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { z } from 'zod';

import { netter } from '../src';

describe('netter parse', () => {
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
        ).rejects.toBeInstanceOf(z.ZodError);
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

                if (!response.ok) return schemas.error.parse(input);

                return schemas.data.parse(input);
            },
        }).json();

        expect(data).toEqual({ data: 'foo' });
        expectTypeOf(data).toMatchTypeOf<{ data: string } | { error: string }>();
    });
});
