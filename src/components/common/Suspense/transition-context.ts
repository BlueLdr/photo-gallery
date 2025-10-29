"use client";

import { createContext, useContext } from "react";

import type { TransitionStartFunction } from "react";

//================================================

type UseTransitionState = { isPending: boolean; startTransition: TransitionStartFunction };

export const UseTransitionContext = createContext<UseTransitionState>({
  isPending: false,
  startTransition: (action: () => void) => action(),
});

export const useTransitionContext = () => useContext(UseTransitionContext);
