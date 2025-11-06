import { styled } from "@mui/material/styles";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import type { AppBarProps } from "@mui/material/AppBar";
import type { ToolbarProps } from "@mui/material/Toolbar";
import type { WithOverrides } from "~/utils";

//================================================

const ControlToolbar = styled<
  React.ComponentType<ToolbarProps & Pick<ControlBarProps, "direction">>
>(Toolbar, {
  shouldForwardProp(propName) {
    return propName !== "direction";
  },
})(({ direction, theme, color }) => ({
  borderRadius: 99999,
  gap: theme.spacing(4),
  background: color ? undefined : theme.palette.grey["800"],
  zIndex: 20,
  opacity: 0.5,
  "&:hover, &:focus-within": {
    opacity: 1,
  },
  ...(direction === "vertical"
    ? {
        flexDirection: "column",
      }
    : {}),
}));

const StyledAppBar = styled(AppBar)`
  border-radius: 99999px;
  background: ${({ theme }) => theme.palette.background.layer};
  &
    .MuiSpeedDial-fab:not(:hover):not(:active):not(.Mui-focused):not(
      :focus
    )[aria-expanded="false"] {
    background-color: inherit;
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

export type ControlBarProps = WithOverrides<AppBarProps, { direction?: "vertical" | "horizontal" }>;

export function ControlBar({ direction, children, ...props }: ControlBarProps) {
  return (
    <StyledAppBar position="static" {...props}>
      <ControlToolbar disableGutters direction={direction}>
        {children}
      </ControlToolbar>
    </StyledAppBar>
  );
}
