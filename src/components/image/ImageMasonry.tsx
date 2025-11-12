import { styled } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";

import { combineRefs, ImageThumbnailSize, useResizeObserver } from "~/utils";

import { THUMBNAIL_SIZE_STYLES } from "./constants";
import { Thumbnail } from "./Thumbnail";

import ImageListItem from "@mui/material/ImageListItem";
import ImageList from "@mui/material/ImageList";

import type { ImageListProps } from "@mui/material/ImageList";
import type { ImageMetadata } from "~/model";

//================================================

const MasonryThumbnail = styled(Thumbnail, {
  shouldForwardProp: propName => propName !== "interactive",
})<{ interactive?: boolean }>`
  width: 100%;
  height: auto;
  ${({ interactive, theme }) =>
    interactive
      ? `
    cursor: pointer;
    transform: scale(1);
    box-shadow: 0 0 0 -1px rgba(0,0,0,0), 0 0 0 0px rgba(0,0,0,0),0px 0 0px 0px rgba(0,0,0,0); 
    transition: ${theme.transitions.create(["transform", "box-shadow", "z-index"])};
    zIndex: 0;
    &:hover {
      box-shadow: ${theme.shadows[4]}; 
      transform: scale(1.03);
      z-index: 5
    } 
  `
      : ""}
`;

const calculateColCount = (containerWidth: number, imageWidth: number, gap: number) => {
  let i = 0;
  let width = 0;
  while (width < containerWidth) {
    width += imageWidth;
    if (i > 0) {
      width += gap;
    }
    i++;
  }

  return i;
};

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
  const [ref, setRef] = useState<HTMLUListElement | null>(null);
  const imageWidth = THUMBNAIL_SIZE_STYLES[size].image * 2;
  const gap = THUMBNAIL_SIZE_STYLES[size].padding;
  const [cols, setCols] = useState<number>();

  useEffect(() => {
    if (ref) {
      setCols(calculateColCount(ref.getBoundingClientRect().width, imageWidth, gap));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  useResizeObserver(
    ref,
    useCallback(
      entry => {
        setCols(calculateColCount(entry.contentRect.width, imageWidth, gap));
      },
      [imageWidth, gap],
    ),
  );

  return (
    <ImageList
      {...props}
      cols={cols}
      ref={combineRefs(setRef, props.ref)}
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
          <MasonryThumbnail src={image.src} block interactive={!!onClickItem} />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
