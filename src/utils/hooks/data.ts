import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { createRemotePromise } from "~/utils";

import { loadStorage, setStorage } from "../helpers";

import type { Dispatch, SetStateAction } from "react";

//================================================

export const useValueRef = <T>(value: T) => {
  const value_ref = useRef<T>(value);
  value_ref.current = value;
  return value_ref;
};

export interface StateObjectSetAction<T extends object> {
  (value: Partial<T>): void;

  (cb: (prevState: T) => T): void;
}

export const useStateObject = <T extends object>(initialState: T) => {
  const [state, setAllState] = useState(initialState);
  const setState = useCallback<StateObjectSetAction<T>>(newState => {
    if (typeof newState === "function") {
      return setAllState(newState);
    }
    setAllState(prevState => ({ ...prevState, ...newState }));
  }, []);
  return [state, setState] as const;
};

//================================================

/** Creates a promise that can be resolved/rejected from outside its executor */
export const useRemotePromise = <T>() => {
  return useMemo(() => createRemotePromise<T>(), []);
  /*
  const remote = useRef<PromiseRemote<T> | undefined>(undefined);
  const [promise, setPromise] = useState(() => {
    const { promise, resolve, reject } = Promise.withResolvers<T>();
    remote.current = { resolve, reject };
    return promise;
  });

  const reset = useCallback(() => {
    const { promise, resolve, reject } = Promise.withResolvers<T>();
    setPromise(promise);
    remote.current = { resolve, reject };
  }, []);

  return [promise, remote, reset] as const;*/
};

//================================================

export interface UseStorageStateTransformer<T, S> {
  to: (value: S) => T;
  from: (value: T) => S;
}

interface UseStorageState {
  <T, S = T>(
    key: string,
    initialState: T | (() => T),
    transform?: UseStorageStateTransformer<T, S>,
  ): [S, Dispatch<SetStateAction<S>>, () => void];

  <T = undefined, S = T>(
    key: string,
    transform?: UseStorageStateTransformer<T, S>,
  ): [S | undefined, Dispatch<SetStateAction<S | undefined>>, () => void];
}

export const useStorageState: UseStorageState = <T, S = T>(
  key: string,
  initialValue?: T | (() => T),
  transform?: UseStorageStateTransformer<T, S>,
) => {
  const [value, _setValue] = useState<S | undefined>(() => {
    const rawValue = loadStorage(
      key,
      typeof initialValue === "function" ? (initialValue as () => T)() : initialValue,
    );
    return transform && rawValue !== undefined
      ? transform.from(rawValue)
      : (rawValue as S | undefined);
  });

  const reload = useCallback(() => {
    const rawValue = loadStorage(
      key,
      typeof initialValue === "function" ? (initialValue as () => T)() : initialValue,
    );
    _setValue(
      transform && rawValue !== undefined ? transform.from(rawValue) : (rawValue as S | undefined),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, transform?.from]);

  const setValue = useCallback<Dispatch<SetStateAction<S>>>(
    newState => {
      _setValue(oldState => {
        const newValue =
          typeof newState === "function"
            ? (newState as (state: S | undefined) => S | undefined)(oldState)
            : newState;
        setStorage(
          key,
          newValue && transform ? transform.to(newValue) : (newValue as T | undefined),
        );
        const updatedValue = loadStorage<T>(key);
        return updatedValue !== undefined && transform
          ? transform.from(updatedValue)
          : (updatedValue as S | undefined);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, transform?.to],
  );

  return [value, setValue, reload] as const;
};

//================================================

const defaultDidChange = <T>(oldValue: T, newValue: T) => oldValue !== newValue;

export interface UseChangeEffectOptions<T> {
  /** Custom function to determine equality of new/old values */
  didChange?: (oldValue: T, newValue: T) => boolean;
  /** If true, the effect callback will be invoked when the component mounts */
  triggerOnMount?: boolean;
}

/**
 * useEffect that only triggers when the given value changes (and optionally on mount)
 * @param callback The callback to invoke when the effect is triggered
 * @param value The value to monitor for changes
 * @param options Additional options to customize behavior
 */
export const useChangeEffect = <T>(
  callback: (newValue: T, oldValue: T) => void | (() => void),
  value: T,
  options?: UseChangeEffectOptions<T>,
) => {
  const { triggerOnMount, didChange = defaultDidChange } = options ?? {};
  const prevValue = useRef(value);
  const hasMounted = useRef(false);
  const callbackRef = useValueRef(callback);

  useEffect(() => {
    const hasAlreadyMounted = hasMounted.current;
    hasMounted.current = true;
    // if the value has changed, or the component is mounting and the triggerOnMount flag is set
    if ((!hasAlreadyMounted && triggerOnMount) || didChange(prevValue.current, value)) {
      const oldValue = prevValue.current;
      prevValue.current = value;
      // invoke the callback
      return callbackRef.current(value, oldValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, didChange, callbackRef]);
};
