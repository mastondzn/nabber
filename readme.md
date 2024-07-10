# Netter

Netter is a small and ergonomic HTTP client that wraps the Fetch API, providing a more convenient interface for making HTTP requests.

## Installation

```bash
pnpm add netter
```

## Usage

```typescript
import { netter } from 'netter';

await netter.post('https://jsonplaceholder.typicode.com/posts', {
    json: { title: 'foo', body: 'bar', userId: 1 },
});

const data = await netter.get('https://jsonplaceholder.typicode.com/posts/1').json();
```
