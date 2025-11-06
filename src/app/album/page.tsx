import { use, useContext } from "react";

import {
  ErrorView,
  ImageCarousel,
  ImageGrid,
  ProgressIndicator,
  SuspenseBoundary,
} from "~/components/common";
import { ViewSpeedDialControls } from "~/components/controls";
import { ViewContext, ViewStateProvider } from "~/context";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import type { ImageMetadata } from "~/model";
import type { ApiResponse } from "~/utils";

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

  const { layout, setLayout, size, setSize } = useContext(ViewContext);

  if (imageData.error) {
    return <ErrorView error={imageData.error} />;
  }

  return (
    <Grid height="100%" position="relative">
      <Grid position="absolute" top={16} left={16}>
        <ViewSpeedDialControls
          direction="right"
          layout={layout}
          setLayout={setLayout}
          size={size}
          setSize={setSize}
        />
      </Grid>
      {layout === "grid" ? (
        <ImageGrid images={imageData.data} maxHeight="100vh" maxWidth="100%" size={size} />
      ) : (
        <ImageCarousel
          images={imageData.data}
          maxHeight="100vh"
          maxWidth="100%"
          height="100%"
          // size="large"
          // onClickItem={image => setSelectedImage(image)}
        />
      )}
    </Grid>
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
      <ViewStateProvider>
        <AlbumContent {...props} />
      </ViewStateProvider>
    </SuspenseBoundary>
  );
}
