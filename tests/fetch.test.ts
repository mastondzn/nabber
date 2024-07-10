import { describe, expect, it, vi } from 'vitest';

import { netter } from '../src';

// no DOMException in node types, but it is globally exposed in v17+
declare class DOMException extends Error {}

describe('netter fetch', () => {
    it('should be compatible with fetch-like calling', async () => {
        const response = await netter('https://example.com/json');
        const data = await response.json();
        expect(data).toEqual({ data: 'foo' });

        const error = await netter('https://example.com/error');
        expect(error.status).toBe(404);
        expect(await error.json()).toEqual({ error: 'Not Found' });
    });

    it('should work with fetch option method', async () => {
        const response = await netter('https://example.com/method', { method: 'POST' });
        expect(await response.text()).toBe('POST');
    });

    it('should work with stuff like abort signals', async () => {
        vi.useFakeTimers();
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 500);

        try {
            const promise = netter('https://example.com/one-second', {
                signal: controller.signal,
            });
            vi.advanceTimersByTime(750);
            await promise;

            expect(false).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(DOMException);
        }

        vi.useRealTimers();
    });
});
