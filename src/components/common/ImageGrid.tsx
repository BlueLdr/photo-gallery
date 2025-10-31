import { ImageGridItem } from "./ImageGridItem";

import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import type { GridProps } from "@mui/material/Grid";
import type { ImageMetadata } from "~/utils";

//================================================

const SIZE_MAP: Record<Required<ImageGridProps>["size"], number> = {
  small: 128,
  medium: 196,
  large: 320,
};

export type ImageGridProps = Omit<GridProps<typeof List>, "size" | "component"> & {
  images: ImageMetadata[];
  size?: "small" | "medium" | "large";
  interactive?: boolean;
  onClickItem?: (item: ImageMetadata, event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  rowCount?: number;
  columnCount?: number;
};

export function ImageGrid({
  images,
  size = "medium",
  onClickItem,
  rowCount,
  columnCount,
  ...props
}: ImageGridProps) {
  return (
    <Grid
      display="grid"
      container
      gridTemplateColumns={`repeat(${columnCount ?? "auto-fit"}, ${SIZE_MAP[size]}px)`}
      gridTemplateRows={rowCount ? `repeat(${rowCount}, auto)` : undefined}
      justifyContent="space-between"
      width="100%"
      gap={2}
      p={4}
      {...props}
      component={List}
    >
      {images.map(item => (
        <ImageGridItem
          key={item.meta.path}
          image={item}
          size={size}
          onClick={onClickItem ? e => onClickItem(item, e) : undefined}
          component={ListItem}
          disablePadding
          disableGutters
        />
      ))}
    </Grid>
  );
}
