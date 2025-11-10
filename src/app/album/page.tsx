import { use, useContext, useMemo } from "react";

import {
  ErrorView,
  ImageCarousel,
  ImageGrid,
  ProgressIndicator,
  SuspenseBoundary,
} from "~/components/common";
import { ViewSpeedDialControls } from "~/components/controls";
import { ImageMasonry, ImageModal } from "~/components/image";
import { ViewContext, ViewStateProvider } from "~/context";
import { createFuzzyImageSearch } from "~/model";

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

function AlbumContent({ imageData }: { imageData: ImageMetadata[] }) {
  const { layout, size, search, filters, selectedImage, setSelectedImage } =
    useContext(ViewContext);
  const imageSearch = useMemo(() => createFuzzyImageSearch(imageData), [imageData]);
  const images = useMemo(() => {
    const searchResults = search ? imageSearch?.(search).map(r => r.item) : imageData;
    return filters.tags?.length
      ? searchResults?.filter(img => img.meta.tags.some(tag => filters.tags?.includes(tag)))
      : searchResults;
  }, [filters.tags, imageData, imageSearch, search]);

  const curIndex = selectedImage ? images?.indexOf(selectedImage) : undefined;
  console.log(`curIndex, images: `, curIndex, images);

  return (
    <Grid height="100%" position="relative">
      <Grid position="fixed" top={16} left={16} zIndex={20}>
        <ViewSpeedDialControls direction="right" />
      </Grid>
      <ImageModal
        image={selectedImage}
        closeModal={() => setSelectedImage(undefined)}
        {...(curIndex != null && images
          ? {
              showNextImage:
                curIndex < images.length - 1
                  ? () => setSelectedImage(images[curIndex + 1])
                  : undefined,
              showPrevImage:
                curIndex > 0 ? () => setSelectedImage(images[curIndex - 1]) : undefined,
            }
          : {})}
      />
      {layout === "grid" ? (
        <ImageGrid
          images={images}
          maxHeight="100vh"
          maxWidth="100%"
          size={size}
          onClickItem={image => setSelectedImage(image)}
        />
      ) : layout === "masonry" ? (
        <ImageMasonry
          images={images}
          sx={{ maxWidth: "100vw", width: "100%" }}
          size={size}
          onClickItem={image => setSelectedImage(image)}
        />
      ) : (
        <ImageCarousel
          images={images}
          maxHeight="100vh"
          maxWidth="100%"
          height="100%"
          // size="large"
        />
      )}
    </Grid>
  );
}

function AlbumContainer({ imageData: imageDataPromise }: Omit<AlbumProps, "setLoadedCount">) {
  const imageData = use(imageDataPromise);

  if (imageData.error) {
    return <ErrorView error={imageData.error} />;
  }

  return <AlbumContent imageData={imageData.data} />;
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
        <AlbumContainer {...props} />
      </ViewStateProvider>
    </SuspenseBoundary>
  );
}
