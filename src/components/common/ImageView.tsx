import { useEffect, useState } from "react";

import { classNameWithModifiers } from "~/utils";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import type { BoxProps } from "@mui/material/Box";
import type { DistributiveOmit, ImageMetadata } from "~/utils";

//================================================

export type FullImageProps = DistributiveOmit<BoxProps<"img", { component?: "img" }>, "src"> & {
  data: ImageMetadata;
};

export function ImageView({ data, ...props }: FullImageProps) {
  // const [img, setImg] = useState<HTMLImageElement>();

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    return () => {
      setLoaded(false);
    };
  }, [data.src]);

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
      display={loaded ? "contents" : "flex"}
      justifyContent="center"
      alignItems="center"
      position="relative"
      maxHeight="100%"
      maxWidth="100%"
      height="100%"
      width="100%"
    >
      <Box
        component="img"
        width={`${data.meta.width ?? ""}`}
        height={`${data.meta.height ?? ""}`}
        loading="eager"
        {...props}
        src={data.src}
        onLoad={() => setLoaded(true)}
      />
      {!loaded && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="absolute"
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <CircularProgress variant="indeterminate" />
        </Box>
      )}
    </Box>
  );
}
