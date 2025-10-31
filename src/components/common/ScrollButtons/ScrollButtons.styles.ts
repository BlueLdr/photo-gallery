import { DirectionCssMap, ScrollDirection } from "./ScrollButtons.utils";

import type { SxStyleProps } from "~/theme";

//================================================

const makeDirectionalButtonStyles = <Dir extends ScrollDirection>(direction: Dir) => {
  const styles = {} as Record<`button${Dir}`, SxStyleProps>;
  styles[`button${direction}`] = {
    gridArea: direction,
    "& > *": {
      [DirectionCssMap[direction]]: 0,
      justifyContent:
        direction === ScrollDirection.Up || direction === ScrollDirection.Left
          ? "flex-start"
          : "flex-end",
      "&::before": {
        [DirectionCssMap[direction]]: 0,
        maskImage: `linear-gradient(to ${DirectionCssMap[direction]}, rgba(0, 0, 0, 0) 0%, 10%, rgba(0, 0, 0, 0.5) 15%, 20%, rgba(0, 0, 0, 0.9) 40%, 50%, rgb(0, 0, 0) 65%)`,
      },
    },
  };
  return styles;
};

export const scrollButtonsStyles = {
  root: {
    display: "grid",
    gridTemplateColumns: "0 minmax(0, 1fr) 0",
    gridTemplateRows: "0 minmax(0, 1fr) 0",
    gridTemplateAreas: [
      `'${ScrollDirection.Up} ${ScrollDirection.Up} ${ScrollDirection.Up}'
      '${ScrollDirection.Left} content ${ScrollDirection.Right}'
      '${ScrollDirection.Down} ${ScrollDirection.Down} ${ScrollDirection.Down}'`,
    ],
    maxWidth: "100%",
    maxHeight: "100%",
    overflow: "clip",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  contentScroll: {
    gridArea: "content",
    overflowX: "visible",
    overflowY: "visible",
    width: "100%",
    height: "100%",
    maxWidth: "max-content",
    maxHeight: "max-content",
    msOverflowStyle: "none",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  horizontal: {
    overflowX: "scroll",
  },
  vertical: {
    overflowY: "scroll",
  },
  buttonContainer: {
    overflow: "visible",
    position: "relative",
    zIndex: 1,
  },
  buttonContainerHorizontal: {
    height: "100%",
  },
  buttonContainerVertical: {
    width: "100%",
  },
  ...makeDirectionalButtonStyles(ScrollDirection.Up),
  ...makeDirectionalButtonStyles(ScrollDirection.Right),
  ...makeDirectionalButtonStyles(ScrollDirection.Down),
  ...makeDirectionalButtonStyles(ScrollDirection.Left),
  buttonInnerContainer: {
    display: "flex",
    alignItems: "stretch",
    position: "absolute",
    "&::before": {
      content: '" "',
      backgroundColor: `var(--surfaceBackgroundColor)`,
      display: "block",
      position: "absolute",
      zIndex: "-1",
    },
  },
  buttonInnerContainerHorizontal: {
    flexDirection: "row",
    "&, &::before": {
      width: "2.25rem",
      top: 0,
      bottom: 0,
    },
    "& > button": {
      width: "80%",
    },
  },
  buttonInnerContainerVertical: {
    flexDirection: "column",
    "&, &::before": {
      height: "2.25rem",
      left: 0,
      right: 0,
    },
    "& > button": {
      height: "80%",
    },
  },
  button: {
    width: "100%",
    height: "100%",
    maxWidth: "100%",
    maxHeight: "100%",
    minWidth: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "max-content",
    height: "max-content",
  },
} satisfies Record<string, SxStyleProps>;
