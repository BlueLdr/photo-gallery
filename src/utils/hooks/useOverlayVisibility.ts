import { useState } from "react";

import { useDebouncedCallback } from "~/utils";

//================================================

export type OverlayVisibilityParams = {
  hidden?: boolean | "dynamic";
  initialHidden?: boolean;
  delay?: number;
};

export const useOverlayVisibility = ({
  hidden = "dynamic",
  initialHidden = true,
  delay = 2000,
}: OverlayVisibilityParams) => {
  const [visible, setVisible] = useState(hidden === "dynamic" ? !initialHidden : !hidden);
  const hideOverlay = useDebouncedCallback(() => setVisible(false), [], delay);

  return [
    visible,
    hidden === "dynamic"
      ? () => {
          setVisible(true);
          hideOverlay();
        }
      : undefined,
  ] as const;
};
