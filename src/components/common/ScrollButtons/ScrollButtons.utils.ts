const SCROLL_PAGE_OVERLAP_AMOUNT = 0.05; // ratio to root element size

export enum ScrollDirection {
  Up = "Up",
  Right = "Right",
  Down = "Down",
  Left = "Left",
}

export const DirectionCssMap = {
  [ScrollDirection.Up]: "top",
  [ScrollDirection.Right]: "right",
  [ScrollDirection.Down]: "bottom",
  [ScrollDirection.Left]: "left",
} satisfies Record<ScrollDirection, string>;

export const isVertical = (direction: ScrollDirection) =>
  direction === ScrollDirection.Up || direction === ScrollDirection.Down;

export const performScroll = (
  element: HTMLDivElement,
  direction: ScrollDirection,
  buttonOverlap = 0,
  behavior: ScrollBehavior = "smooth",
) => {
  const isVertical_ = isVertical(direction);
  const sign = direction === ScrollDirection.Up || direction === ScrollDirection.Left ? -1 : 1;

  const windowSize = element.getBoundingClientRect()[isVertical_ ? "height" : "width"];

  element.scrollBy({
    [isVertical_ ? "top" : "left"]:
      sign * (1 - 2 * SCROLL_PAGE_OVERLAP_AMOUNT) * windowSize - sign * buttonOverlap,
    behavior,
  });
};
