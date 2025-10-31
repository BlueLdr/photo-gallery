import type { ApiResponse, EntryOf, PropsOfType } from "~/utils";

//================================================

/** Get key/value pairs of a Typescript enum the same way you would from a
 *  normal object with Object.entries */
export const enumEntries = <T>(obj: T): EntryOf<typeof obj>[] =>
  (Object.entries(obj as any) as EntryOf<typeof obj>[]).filter(
    ent =>
      // @ts-expect-error: for numbers, this is valid
      typeof obj[ent[1]] !== "number",
  );

/** Object.keys, but for Typescript enum */
export const enumKeys = <T>(obj: T): (keyof typeof obj)[] => enumEntries(obj).map(ent => ent[0]);

/** Object.values, but for Typescript enum */
export const enumValues = <T>(obj: T): (typeof obj)[keyof typeof obj][] =>
  enumEntries(obj).map(ent => ent[1]);

export const comparator =
  <T extends object>(
    direction: "asc" | "desc",
    extract: PropsOfType<T, string | number> | ((item: T) => number),
    fallback?: (a: T, b: T) => number,
  ) =>
  (a: T, b: T): number => {
    const v_a = typeof extract === "function" ? extract(a) : a[extract];
    const v_b = typeof extract === "function" ? extract(b) : b[extract];
    return (
      (direction === "asc" ? 1 : -1) *
      (v_a < v_b ? -1 : v_a > v_b ? 1 : fallback ? fallback(a, b) : 0)
    );
  };

export const makeRecordFromEntries = <Key extends string | number, Value>(
  entries: [Key, Value][],
) => Object.fromEntries(entries) as Record<Key, Value>;

export type PromiseMap<T> = {
  [K in keyof T]: Promise<ApiResponse<T[K]>>;
};

export const promiseAll = async <T>(promises: PromiseMap<T>): Promise<ApiResponse<T>> => {
  const isArray = Array.isArray(promises);
  const keys = Object.keys(promises) as (keyof T)[];
  const promiseResults = await Promise.allSettled(Object.values(promises));
  for (const res of promiseResults) {
    if (res.status === "rejected") {
      return Promise.reject(res.reason);
    }
    /*if ((res.value as ApiResponse<any>).error) {
      return Promise.reject(res.value);
    }*/
  }

  return {
    data: keys.reduce(
      <K extends keyof T>(obj: T, key: K, i: number) => {
        obj[isArray ? (Number(key) as K) : key] = (
          promiseResults[i] as PromiseFulfilledResult<ApiResponse<T[K]>>
        ).value.data!;
        return obj;
      },
      (isArray ? [] : {}) as T,
    ),
    error: undefined,
  };
};
