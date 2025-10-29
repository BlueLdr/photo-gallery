import { useMemo, useTransition } from "react";

import { UseTransitionContext } from "./transition-context";

//================================================

export const UseTransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPending, startTransition] = useTransition();

  const value = useMemo(() => ({ isPending, startTransition }), [isPending]);

  return <UseTransitionContext.Provider value={value}>{children}</UseTransitionContext.Provider>;
};
