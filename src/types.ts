export type Prettify<T> = { [Key in keyof T]: T[Key] };

export type TypedResponse<T = unknown> = Response & {
    json: <T>() => Promise<T>;
};
