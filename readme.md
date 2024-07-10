# Netter

Netter is a small (~2kB) and ergonomic HTTP client that wraps the Fetch API, providing a more convenient interface for making HTTP requests.

## Installation

```bash
pnpm add netter
```

## Usage

```typescript
import { netter } from 'netter';

const response = await netter.post('https://jsonplaceholder.typicode.com/posts', {
    json: { title: 'foo', body: 'bar', userId: 1 },
});

const data = await netter('https://jsonplaceholder.typicode.com/posts/1').json();
// typeof data is unknown

const data = await netter('https://jsonplaceholder.typicode.com/posts/1', {
    parse: (data) => z.object({ id: z.number() }).parse(data),
}).json();
// typeof data is now { id: number }!
```
