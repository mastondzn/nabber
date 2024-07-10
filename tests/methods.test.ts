import { describe, expect, it } from 'vitest';

import { methods, netter } from '../src';

describe('netter method access', () => {
    for (const method of methods) {
        it(`should work with .${method}`, async () => {
            const response = await netter[method]('https://example.com/method');
            expect(await response.text()).toBe(method.toUpperCase());
        });
    }
});
