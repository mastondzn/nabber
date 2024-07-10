import { describe, expect, it } from 'vitest';

import { HTTPError, netter } from '../src';

describe('netter http error', () => {
    it('should throw https errors', async () => {
        try {
            await netter('https://example.com/error', { throwHttpErrors: true });
            expect(false).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(HTTPError);
            expect((error as HTTPError).response.status).toBe(404);
        }
    });
});
