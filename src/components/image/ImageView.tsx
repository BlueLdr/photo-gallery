import { useEffect, useState } from "react";

import { classNameWithModifiers, useOverlayVisibility } from "~/utils";

import { ImageOverlay } from "./ImageOverlay";

import Box from "@mui/material/Box";

import type { SxStyleProps } from "~/theme";
import type { BoxProps } from "@mui/material/Box";
import type { ImageMetadata } from "~/model";
import type { OverlayVisibilityParams, DistributiveOmit } from "~/utils";
import type { ImageOverlayProps } from "./ImageOverlay";

//================================================

export type FullImageProps = DistributiveOmit<BoxProps<"img", { component?: "img" }>, "src"> & {
  data: ImageMetadata | undefined;
  overlay?: Omit<ImageOverlayProps, "image"> & OverlayVisibilityParams;
  containerStyle?: SxStyleProps;
};

export function ImageView({ data, overlay, containerStyle, ...props }: FullImageProps) {
  // const [img, setImg] = useState<HTMLImageElement>();

  const { hidden, initialHidden, delay, ...overlayProps } = overlay ?? {};
  const [overlayVisible, showOverlay, hideOverlay] = useOverlayVisibility({
    hidden,
    initialHidden,
    delay,
  });

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    return () => {
      setLoaded(false);
    };
  }, [data?.src]);

  /*  useEffect(() => {
    const cancel = { current: false };
    const handle = loadImage(image.src, (element, meta) => {
      if (element instanceof HTMLImageElement) {
        return element.src;
      } else if (element instanceof HTMLCanvasElement) {
        return element.toDataURL(image.meta.mimeType);
      }
    }, { orientation: true });
    return () => {
      if (handle) {
        handle.onload = null;
        handle.onerror = null;
      }
      if (handle instanceof HTMLImageElement) {
        handle.src = NULL_IMAGE
      }
      if (handle instanceof FileReader) {
        handle.abort()
      }
      cancel.current = true;
      setImg(undefined);
    };
  }, [image.meta.mimeType, image.src]);*/

  return (
    <Box
      className={classNameWithModifiers("PgImageView", { "-container": true, "--loaded": loaded })}
      display={overlay || !loaded ? "block" : "contents"}
      justifyContent="center"
      alignItems="center"
      position="relative"
      maxHeight="100%"
      maxWidth="100%"
      height="100%"
      width="100%"
      sx={containerStyle}
      onMouseMove={showOverlay}
      onMouseLeave={hideOverlay}
    >
      {(overlay || !loaded) && (
        <ImageOverlay
          visible={overlayVisible}
          {...overlayProps}
          image={data}
          display="contents"
          loading={!loaded}
        />
      )}
      <Box
        component="img"
        width={`${data?.meta.width ?? ""}`}
        height={`${data?.meta.height ?? ""}`}
        loading="eager"
        {...props}
        src={data?.src}
        onLoad={() => setLoaded(true)}
      />
    </Box>
  );
}
