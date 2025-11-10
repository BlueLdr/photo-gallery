import { styled } from "@mui/material/styles";
import { useCallback, useRef, useState } from "react";

import { combineRefs, ImageThumbnailSize, useResizeObserver } from "~/utils";

import { THUMBNAIL_SIZE_STYLES } from "./constants";
import { Thumbnail } from "./Thumbnail";

import ImageListItem from "@mui/material/ImageListItem";
import ImageList from "@mui/material/ImageList";

import type { ImageListProps } from "@mui/material/ImageList";
import type { ImageMetadata } from "~/model";

//================================================

const MasonryThumbnail = styled(Thumbnail)`
  width: 100%;
  height: auto;
  ${({ onClick }) => (onClick ? `cursor: pointer;` : "")}
`;

export type ImageMasonryProps = Omit<ImageListProps, "variant" | "children"> & {
  images: ImageMetadata[];
  size?: ImageThumbnailSize;
  onClickItem?: (item: ImageMetadata, event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
};

export function ImageMasonry({
  images,
  size = ImageThumbnailSize.md,
  onClickItem,
  ...props
}: ImageMasonryProps) {
  const ref = useRef<HTMLUListElement>(null);
  const imageWidth = THUMBNAIL_SIZE_STYLES[size].image * 2;
  const gap = THUMBNAIL_SIZE_STYLES[size].padding;
  const [cols, setCols] = useState<number>();

  useResizeObserver(
    ref.current,
    useCallback(
      entry => {
        let i = 0;
        let width = 0;
        while (width < entry.contentRect.width) {
          width += imageWidth;
          if (i > 0) {
            width += gap;
          }
          i++;
        }
        setCols(i);
      },
      [imageWidth, gap],
    ),
  );

  return (
    <ImageList
      {...props}
      cols={cols}
      ref={combineRefs(ref, props.ref)}
      variant="masonry"
      gap={gap}
      sx={{
        boxSizing: "border-box",
        padding: `${gap}px`,
        ...props.sx,
      }}
    >
      {images.map(image => (
        <ImageListItem key={image.meta.path} onClick={e => onClickItem?.(image, e)}>
          <MasonryThumbnail src={image.src} block />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
