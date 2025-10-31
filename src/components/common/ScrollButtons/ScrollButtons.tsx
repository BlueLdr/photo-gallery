import { useCallback, useRef, useState } from "react";

import { useMounted, useResizeObserver } from "~/utils";

import { ScrollDirection, performScroll, isVertical } from "./ScrollButtons.utils";
import { scrollButtonsStyles } from "./ScrollButtons.styles";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import ArrowUpward from "@mui/icons-material/ArrowUpward";

import type SvgIcon from "@mui/material/SvgIcon";

//================================================

const ArrowIconMap: Record<ScrollDirection, typeof SvgIcon> = {
  [ScrollDirection.Up]: ArrowUpward,
  [ScrollDirection.Right]: ArrowForwardRounded,
  [ScrollDirection.Down]: ArrowDownward,
  [ScrollDirection.Left]: ArrowBackRounded,
};

//================================================

export type ScrollButtonsProps = {
  children: React.ReactNode;
  disableVertical?: boolean;
  disableHorizontal?: boolean;
};

export function ScrollButtons({
  children,
  disableVertical,
  disableHorizontal,
}: ScrollButtonsProps) {
  // force a re-render after mount so the refs can populate
  useMounted();
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const [visibleButtons, setVisibleButtons] = useState<Record<ScrollDirection, boolean>>({
    [ScrollDirection.Up]: false,
    [ScrollDirection.Right]: false,
    [ScrollDirection.Down]: false,
    [ScrollDirection.Left]: false,
  });

  const onResize = useCallback(() => {
    const root = rootRef.current;
    const content = contentRef.current;
    const contentScroll = contentScrollRef.current;
    if (!root || !contentScroll || !content) {
      return;
    }
    const hasHorizontalOverflow = root.offsetWidth < content.scrollWidth;
    const hasVerticalOverflow = root.offsetHeight < content.scrollHeight;
    setVisibleButtons({
      [ScrollDirection.Up]: hasVerticalOverflow && contentScroll.scrollTop > 0,
      [ScrollDirection.Right]:
        hasHorizontalOverflow &&
        contentScroll.scrollLeft < contentScroll.scrollWidth - contentScroll.offsetWidth,
      [ScrollDirection.Down]:
        hasVerticalOverflow &&
        contentScroll.scrollTop < contentScroll.scrollHeight - contentScroll.offsetHeight,
      [ScrollDirection.Left]: hasHorizontalOverflow && contentScroll.scrollLeft > 0,
    });
  }, []);

  useResizeObserver(rootRef.current, onResize);
  useResizeObserver(contentRef.current, onResize);

  const renderButton = (direction: ScrollDirection) => {
    if (
      !visibleButtons[direction] ||
      (isVertical(direction) ? disableVertical : disableHorizontal)
    ) {
      return null;
    }
    const Icon = ArrowIconMap[direction];
    return (
      <Box
        key={direction}
        className="PgScrollButtons-buttonContainer"
        sx={{
          ...scrollButtonsStyles.buttonContainer,
          ...scrollButtonsStyles[
            `buttonContainer${isVertical(direction) ? "Vertical" : "Horizontal"}`
          ],
          ...scrollButtonsStyles[`button${direction}`],
        }}
        aria-hidden
      >
        <Box
          className="PgScrollButtons-buttonInnerContainer"
          sx={{
            ...scrollButtonsStyles.buttonInnerContainer,
            ...scrollButtonsStyles[
              `buttonInnerContainer${isVertical(direction) ? "Vertical" : "Horizontal"}`
            ],
          }}
        >
          <IconButton
            aria-hidden
            sx={scrollButtonsStyles.button}
            onClick={e => {
              const contentScroll = contentScrollRef.current;
              if (!contentScroll) {
                return;
              }

              const buttonSize =
                e.currentTarget[isVertical(direction) ? "offsetHeight" : "offsetWidth"];
              performScroll(contentScroll, direction, 2 * buttonSize);
            }}
          >
            <Icon />
          </IconButton>
        </Box>
      </Box>
    );
  };

  return (
    <Box ref={rootRef} className="PgScrollButtons" sx={scrollButtonsStyles.root}>
      <Box
        ref={contentScrollRef}
        onScroll={onResize}
        className="PgScrollButtons-contentScroll"
        sx={{
          ...scrollButtonsStyles.contentScroll,
          ...((visibleButtons[ScrollDirection.Up] || visibleButtons[ScrollDirection.Down]) &&
            scrollButtonsStyles.vertical),
          ...((visibleButtons[ScrollDirection.Right] || visibleButtons[ScrollDirection.Left]) &&
            scrollButtonsStyles.horizontal),
        }}
      >
        <Box ref={contentRef} className="PgScrollButtons-content" sx={scrollButtonsStyles.content}>
          {children}
        </Box>
      </Box>
      {renderButton(ScrollDirection.Up)}
      {renderButton(ScrollDirection.Left)}
      {renderButton(ScrollDirection.Right)}
      {renderButton(ScrollDirection.Down)}
    </Box>
  );
}
