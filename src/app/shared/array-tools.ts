export function flatten<T>(arr: T[][]) {
    return [].concat.apply([], arr) as T[];
}
