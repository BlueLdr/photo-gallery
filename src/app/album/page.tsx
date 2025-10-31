import { use } from "react";

import { ErrorView, ImageCarousel, ProgressIndicator, SuspenseBoundary } from "~/components/common";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import type { ApiResponse, ImageMetadata } from "~/utils";

//================================================

export type AlbumProps = {
  title?: React.ReactNode;
  imageData: Promise<ApiResponse<ImageMetadata[]>>;
  reset: () => void;
  loadedCount: number;
  totalCount: number;
};

function AlbumContent({ imageData: imageDataPromise }: Omit<AlbumProps, "setLoadedCount">) {
  const imageData = use(imageDataPromise);

  if (imageData.error) {
    return <ErrorView error={imageData.error} />;
  }

  return (
    <ImageCarousel
      images={imageData.data}
      maxHeight="100vh"
      maxWidth="100%"
      height="100%"
      // size="large"
      // onClickItem={image => setSelectedImage(image)}
    />
  );
}

export function Album(props: AlbumProps) {
  return (
    <SuspenseBoundary
      initialLoadingView={
        <Grid container height="100%" alignItems="center" justifyContent="center">
          <ProgressIndicator
            size={96}
            labelText={
              <Typography variant="h6">
                Loading {props.title ? `album "${props.title}"` : "images"} ({props.loadedCount} /{" "}
                {props.totalCount})
              </Typography>
            }
            value={props.loadedCount}
            total={props.totalCount}
          />
        </Grid>
      }
    >
      {props.title && (
        <Typography variant="h3" mb={8}>
          {props.title}
        </Typography>
      )}
      <AlbumContent {...props} />
    </SuspenseBoundary>
  );
}
