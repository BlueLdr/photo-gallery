"use client";

import { styled } from "@mui/material/styles";
import { Children } from "react";

import { joinClassNames } from "~/utils";

import Box from "@mui/material/Box";

import type { BoxProps } from "@mui/material/Box";

//================================================

const BASE_CLASS = "PgSeparatedList";
const SEPARATOR_CLASS = `${BASE_CLASS}-separator`;
const ITEM_CLASS = `${BASE_CLASS}-item`;
const DEFAULT_SEPARATOR = "•";

const Root = styled(Box, {
  shouldForwardProp: propName => propName !== "noFlex" && propName !== "inline",
})<{ noFlex?: boolean; inline?: boolean }>(({ noFlex, inline }) => {
  return {
    display: noFlex ? (inline ? "inline" : "block") : inline ? "inline-flex" : "flex",
    ...(noFlex
      ? {
          "& > *": {
            display: "inline",
          },
        }
      : {}),
  };
});

const Separator = styled("span", {
  shouldForwardProp: propName => propName !== "noFlex",
})<{ noFlex?: boolean }>(({ theme, noFlex }) => ({
  [`&:has(+ .${ITEM_CLASS}:empty:last-child)`]: {
    display: "none",
  },
  ...(noFlex
    ? {
        marginInline: theme.spacing(1.5),
      }
    : {}),
}));

const Item = styled("span")({
  [`&:empty, &:empty + .${SEPARATOR_CLASS}`]: {
    display: "none",
  },
});

//================================================

export type SeparatedListProps<T extends boolean = false> = Omit<
  BoxProps<T extends true ? "div" : "span">,
  "children"
> & {
  block?: T;
  noFlex?: boolean;
} & (
    | {
        text?: false;
        children: React.ReactNode;
        separator?: string | number | React.ReactElement<any>;
      }
    | {
        text: true;
        children: (string | undefined | null)[];
        separator?: string;
      }
  );

export function SeparatedList<T extends boolean = false>(props: SeparatedListProps<T>) {
  if (props.text) {
    return props.children
      .filter(c => !!c)
      .join(` ${props.separator?.trim() || DEFAULT_SEPARATOR} `);
  }

  const { children, className, noFlex, block, separator, ...otherProps } = props;

  let separatorValue = separator;
  if (separatorValue == null) {
    separatorValue = noFlex ? ` ${DEFAULT_SEPARATOR} ` : DEFAULT_SEPARATOR;
  }

  const items = Children.toArray(children);

  const defaultProps: React.ComponentProps<typeof Root> = noFlex
    ? {}
    : {
        gap: theme => theme.spacing(1),
        inline: !block,
      };

  return (
    <Root
      component={block ? "div" : "span"}
      {...defaultProps}
      {...otherProps}
      className={joinClassNames(BASE_CLASS, className)}
    >
      {items.reduce<typeof items>((list, child, index) => {
        if (child == null || child === "") {
          return list;
        }
        if (index > 0) {
          list.push(
            <Separator noFlex={noFlex} key={`separator-${index}`} className={SEPARATOR_CLASS}>
              {separatorValue}
            </Separator>,
          );
        }
        list.push(
          <Item key={`item-${index}`} className={ITEM_CLASS}>
            {child}
          </Item>,
        );
        return list;
      }, [])}
    </Root>
  );
}
