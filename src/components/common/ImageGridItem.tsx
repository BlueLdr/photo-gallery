import { alpha } from "@mui/material/styles";

import { Thumbnail } from "~/components/common";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import type { OverrideProps } from "@mui/types";
import type { GridTypeMap } from "@mui/material/Grid";
import type { TypographyProps } from "@mui/material/Typography";
import { type DistributiveOmit, type ImageMetadata, joinClassNames } from "~/utils";

//================================================

const SIZE_MAP: Record<
  Required<ImageGridItemProps>["size"],
  { tile: number; image: number; radius: number; font: TypographyProps["variant"] }
> = {
  small: {
    tile: 128,
    image: 96,
    radius: 6,
    font: "caption",
  },
  medium: {
    tile: 196,
    image: 144,
    radius: 10,
    font: "body1",
  },
  large: {
    tile: 320,
    image: 256,
    radius: 18,
    font: "h6",
  },
};

export type ImageGridItemCustomProps = {
  size?: "small" | "medium" | "large";
  image: ImageMetadata;
  selected?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ImageGridItemTypeMap<P = {}, D extends React.ElementType = "div"> {
  props: DistributiveOmit<GridTypeMap<P, D>["props"], keyof ImageGridItemCustomProps> &
    ImageGridItemCustomProps;
  defaultComponent: D;
}

export type ImageGridItemProps<D extends React.ElementType = GridTypeMap["defaultComponent"]> =
  OverrideProps<ImageGridItemTypeMap<{ component?: D }, D>, D>;

export function ImageGridItem<D extends React.ElementType = GridTypeMap["defaultComponent"]>({
  image,
  component,
  size = "medium",
  sx,
  className,
  selected,
  ...props
}: ImageGridItemProps<D>) {
  const sizes = SIZE_MAP[size];
  return (
    <Grid
      component={component}
      className={joinClassNames(className, selected && "Mui-selected")}
      container
      direction="column"
      gap={2}
      p={2}
      alignItems="center"
      tabIndex={props.onClick ? 0 : undefined}
      sx={{
        cursor: "pointer",
        borderRadius: `${sizes.radius}px`,
        "&:hover": {
          backgroundColor: theme => alpha(theme.palette.primary.main, 0.4),
        },
        "&:focus": {
          backgroundColor: theme => alpha(theme.palette.primary.dark, 0.4),
        },
        "&:focus:hover": {
          backgroundColor: theme => alpha(theme.palette.primary.main, 0.5),
        },
        "&:active, &:hover:active": {
          backgroundColor: theme => alpha(theme.palette.primary.main, 0.6),
        },
        "&.Mui-selected": {
          backgroundColor: theme => alpha(theme.palette.primary.dark, 0.6),
        },
        ...sx,
      }}
      {...props}
    >
      <Thumbnail size={sizes.image} src={image.thumbnailSrc || image.src} />
      <Typography variant={sizes.font}>{image.meta.filename}</Typography>
    </Grid>
  );
}
