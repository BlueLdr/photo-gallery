import { ImageThumbnailSize } from "~/utils";

import Stack from "@mui/material/Stack";
import GridViewIcon from "@mui/icons-material/GridViewSharp";
import AppsIcon from "@mui/icons-material/AppsSharp";
import Slider from "@mui/material/Slider";

import type { StackProps } from "@mui/material/Stack";
import type { ValueAndSetter, WithOverrides } from "~/utils";
import type { SliderProps } from "@mui/material/Slider";

//================================================

export type SizeControlProps = WithOverrides<
  SliderProps,
  ValueAndSetter<"value", ImageThumbnailSize> & Pick<StackProps, "sx">
>;

export function SizeControl({ value, setValue, sx, ...props }: SizeControlProps) {
  const width = props.size === "small" ? 24 : 36;
  return (
    <Stack direction="row" spacing={4} alignItems="center" sx={sx}>
      <AppsIcon />
      <Slider
        aria-label="Thumbnail size"
        {...props}
        value={value}
        onChange={(_, newValue) => setValue(Array.isArray(newValue) ? newValue[0] : newValue)}
        min={ImageThumbnailSize.xs}
        max={ImageThumbnailSize.xl}
        step={1}
        sx={{
          width: theme => theme.spacing(width),
        }}
      />
      <GridViewIcon />
    </Stack>
  );
}
