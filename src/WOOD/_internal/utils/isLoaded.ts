export function isLoaded<T extends unknown>(
  loaded: boolean,
  value: T | undefined
): value is T {
  return loaded;
}
