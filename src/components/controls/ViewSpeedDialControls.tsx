import { LAYOUT_OPTIONS } from "./constants";
import { ControlBar } from "./ControlBar";
import { SpeedDialSelector } from "./SpeedDialSelector";
import { SizeControl } from "./SizeControl";

import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import PhotoSizeSelectLargeIcon from "@mui/icons-material/PhotoSizeSelectLarge";

import type { ValueAndSetter, ImageGalleryLayout, ImageThumbnailSize } from "~/utils";
import type { FabProps } from "@mui/material/Fab";

//================================================

const commonFabProps: FabProps = {
  size: "medium",
  sx: {
    '&:not(:hover):not(:active):not(.Mui-focused):not(:focus)[aria-expanded="false"]': {
      boxShadow: "none",
    },
  },
};

export type ViewSpeedDialControlsProps = ValueAndSetter<"layout", ImageGalleryLayout> &
  ValueAndSetter<"size", ImageThumbnailSize> &
  Pick<FabProps, "color"> & {
    direction: "left" | "right";
  };

export function ViewSpeedDialControls({
  color,
  layout,
  setLayout,
  size,
  setSize,
  direction,
}: ViewSpeedDialControlsProps) {
  const fabProps = { ...commonFabProps, color };
  return (
    <ControlBar direction="vertical" color={color}>
      <SpeedDialSelector
        ariaLabel="Image gallery layout"
        options={LAYOUT_OPTIONS}
        defaultIcon={<GridViewRoundedIcon />}
        value={layout}
        setValue={setLayout}
        FabProps={fabProps}
        direction={direction}
      />
      <SpeedDialSelector
        ariaLabel="Image thumbnail size"
        defaultIcon={<PhotoSizeSelectLargeIcon />}
        value={layout}
        setValue={setLayout}
        FabProps={fabProps}
        direction={direction}
      >
        <SizeControl
          value={size}
          setValue={setSize}
          sx={{ [direction === "left" ? "paddingLeft" : "paddingRight"]: 4 }}
        />
      </SpeedDialSelector>
    </ControlBar>
  );
}
