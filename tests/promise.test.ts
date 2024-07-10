import { describe, expect, it } from 'vitest';

import { netter } from '../src';

describe('netterPromise', () => {
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
});
