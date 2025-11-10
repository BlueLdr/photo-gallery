import { ImageThumbnailSize } from "~/utils";

import { THUMBNAIL_SIZE_STYLES } from "./constants";
import { ImageGridItem } from "./ImageGridItem";

import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import type { GridProps } from "@mui/material/Grid";
import type { ImageMetadata } from "~/model";

//================================================

export type ImageGridProps = Omit<GridProps<typeof List>, "size" | "component"> & {
  images: ImageMetadata[];
  size?: ImageThumbnailSize;
  interactive?: boolean;
  onClickItem?: (item: ImageMetadata, event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  rowCount?: number;
  columnCount?: number;
};

export function ImageGrid({
  images,
  size = ImageThumbnailSize.md,
  onClickItem,
  rowCount,
  columnCount,
  ...props
}: ImageGridProps) {
  return (
    <Grid
      display="grid"
      container
      gridTemplateColumns={`repeat(${columnCount ?? "auto-fit"}, ${THUMBNAIL_SIZE_STYLES[size].image + 2 * THUMBNAIL_SIZE_STYLES[size].padding}px)`}
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
