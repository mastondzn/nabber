export function fromEntries<T extends [string, unknown][]>(
    entries: T,
): Record<T[number][0], T[number][1]> {
    return Object.fromEntries(entries) as Record<T[number][0], T[number][1]>;
}
