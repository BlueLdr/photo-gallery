import { styled, useTheme } from "@mui/material/styles";
import { useContext, useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";

import { ScrollButtons } from "~/components/common";
import { ViewContext } from "~/context";

import { ImageGridItem } from "./ImageGridItem";
import { ImageView } from "./ImageView";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";

import type { BoxProps } from "@mui/material/Box";
import type { ImageMetadata } from "~/model";

//================================================

const StyledTransitionGroup = styled(TransitionGroup)({
  position: "relative",
  height: "100%",
  width: "100%",
  "&:has(> :not(:only-child))": {
    overflow: "hidden",
  },
});

export type ImageCarouselProps = { images: ImageMetadata[]; initialIndex?: number } & BoxProps;

export function ImageCarousel({ images, initialIndex = 0, ...props }: ImageCarouselProps) {
  const theme = useTheme();
  const { size } = useContext(ViewContext);

  const [activeIndex, setActiveIndex] = useState(() => (images[initialIndex] ? initialIndex : 0));
  const [prevIndex, setPrevIndex] = useState<number>();
  const [nextIndex, setNextIndex] = useState<number>();

  const goToNextImage = () => {
    setNextIndex(activeIndex + 1);
  };
  const goToPrevImage = () => {
    setNextIndex(activeIndex - 1);
  };

  const direction =
    nextIndex != undefined
      ? nextIndex < activeIndex
        ? "left"
        : "right"
      : prevIndex != undefined
        ? prevIndex < activeIndex
          ? "left"
          : "right"
        : undefined;

  useEffect(() => {
    if (nextIndex != undefined) {
      setPrevIndex(activeIndex);
      setActiveIndex(nextIndex);
      setNextIndex(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextIndex]);

  return (
    <Box
      display="grid"
      gridTemplateRows="minmax(0, 1fr) auto"
      alignItems="center"
      gap={4}
      {...props}
      onKeyDown={e => {
        props.onKeyDown?.(e);
        if (e.key === "ArrowLeft" && activeIndex > 0) {
          e.preventDefault();
          goToPrevImage();
        } else if (e.key === "ArrowRight" && activeIndex < images.length - 1) {
          e.preventDefault();
          goToNextImage();
        }
      }}
    >
      <Grid
        container
        display="grid"
        gridTemplateColumns="4rem minmax(0, 1fr) 4rem"
        gridTemplateRows="minmax(0, 1fr)"
        justifyContent="space-around"
        alignItems="center"
        gap={2}
        pt={4}
        flexWrap="nowrap"
        height="100%"
        tabIndex={0}
      >
        <Grid container alignItems="center" justifyContent="center">
          {activeIndex > 0 && (
            <IconButton onClick={goToPrevImage}>
              <ArrowBackRounded />
            </IconButton>
          )}
        </Grid>
        <StyledTransitionGroup>
          <Slide
            key={activeIndex}
            direction={direction}
            className={nextIndex != undefined ? "MuiSlide-out" : undefined}
            appear={!!direction}
            unmountOnExit
            onEntered={() => {
              setPrevIndex(undefined);
            }}
            timeout={{
              enter: theme.transitions.duration.enteringScreen,
              exit: theme.transitions.duration.leavingScreen,
            }}
            easing={theme.transitions.easing.easeInOut}
          >
            <ImageView
              data={images[activeIndex]}
              sx={{
                height: "100%",
                width: "100%",
                objectFit: "contain",
                [".PgImageView-container:not(:only-child):has(~ .PgImageView--loaded) > &.MuiSlide-out, " +
                ".PgImageView--loaded ~ .PgImageView-container:not(:only-child) > &.MuiSlide-out"]:
                  {
                    position: "absolute",
                    left: 0,
                    top: 0,
                  },
              }}
            />
          </Slide>
        </StyledTransitionGroup>

        <Grid container alignItems="center" justifyContent="center">
          {activeIndex < images.length - 1 && (
            <IconButton onClick={goToNextImage}>
              <ArrowForwardRounded />
            </IconButton>
          )}
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          "--surfaceBackgroundColor": theme => theme.palette.background.paper,
          backgroundColor: theme => theme.palette.background.paper,
          borderTop: theme => `1px solid ${theme.palette.divider}`,
        }}
      >
        <ScrollButtons disableVertical>
          <Grid container alignItems="center" gap={4} sx={{ overflowX: "auto" }} p={2}>
            {images.map((image, i) => (
              <ImageGridItem
                key={image.meta.path}
                size={size}
                image={image}
                selected={i === activeIndex}
                onClick={() => setNextIndex(i)}
                showOnSelected
              />
            ))}
          </Grid>
        </ScrollButtons>
      </Grid>
    </Box>
  );
}

// [user action to change]
// direction of current item gets changed to outbound dir
// ----
// old item unmounted
// new item mounted with new index and inbound dir
// --
// [new item animation finishes]
//   direction of current item is cleared
