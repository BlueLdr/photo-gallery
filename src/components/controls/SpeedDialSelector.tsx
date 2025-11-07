import { alpha } from "@mui/material/styles";
import { useState } from "react";

import ToggleButton from "@mui/material/ToggleButton";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import CloseIcon from "@mui/icons-material/Close";

import type { SxStyleProps } from "~/theme";
import type { ControlOption } from "./types";
import type { SpeedDialProps } from "@mui/material/SpeedDial";
import type { WithOverrides, ValueAndSetter } from "~/utils";

//================================================

const verticalStyles = {
  left: 0,
  right: 0,
} satisfies SxStyleProps;
const horizontalStyles = {
  top: 0,
  bottom: 0,
} satisfies SxStyleProps;
const positionStyles = (size: Required<SpeedDialProps>["FabProps"]["size"], custom: boolean) => {
  const padding = size === "large" ? 16 : size === "medium" ? 14 : 12;
  const borderRadius = `${padding * 2}px`;
  return {
    up: {
      ...verticalStyles,
      bottom: 0,
      paddingBottom: theme => theme.spacing(padding),
      paddingTop: custom ? theme => theme.spacing(4) : undefined,
      marginBottom: 0,
      borderRadius,
    },
    right: {
      ...horizontalStyles,
      left: 0,
      paddingLeft: theme => theme.spacing(padding),
      paddingRight: custom ? theme => theme.spacing(4) : undefined,
      marginLeft: 0,
      borderRadius,
    },
    down: {
      ...verticalStyles,
      top: 0,
      paddingTop: theme => theme.spacing(padding),
      paddingBottom: custom ? theme => theme.spacing(4) : undefined,
      marginTop: 0,
      borderRadius,
    },
    left: {
      ...horizontalStyles,
      right: 0,
      paddingRight: theme => theme.spacing(padding),
      paddingLeft: custom ? theme => theme.spacing(4) : undefined,
      marginRight: 0,
      borderRadius,
    },
  } satisfies Record<Required<SpeedDialProps>["direction"], SxStyleProps>;
};

//================================================

export type LayoutSelectorProps<T> = WithOverrides<
  SpeedDialProps,
  {
    defaultIcon?: React.ReactElement;
    openIcon?: React.ReactElement;
    icon?: never;
  } & (
    | (ValueAndSetter<"value", T> & {
        options: ControlOption<T>[];
        children?: never;
      })
    | {
        value?: never;
        setValue?: never;
        options?: never;
        children: React.ReactNode;
      }
  )
>;

export function SpeedDialSelector<T extends string | number>({
  value,
  setValue,
  options,
  defaultIcon,
  openIcon = <CloseIcon />,
  children,
  sx,
  ...props
}: LayoutSelectorProps<T>) {
  const [open, setOpen] = useState(false);
  const SelectedIcon = options ? options.find(opt => opt.value === value)?.Icon : undefined;

  return (
    <SpeedDial
      open={open}
      {...props}
      onOpen={(e, reason) => {
        if (reason === "toggle") {
          setOpen(true);
        }
        props.onOpen?.(e, reason);
      }}
      onClose={(e, reason) => {
        if (reason !== "mouseLeave") {
          setOpen(false);
        }
        props.onClose?.(e, reason);
      }}
      icon={
        <SpeedDialIcon icon={SelectedIcon ? <SelectedIcon /> : defaultIcon} openIcon={openIcon} />
      }
      sx={{
        ...sx,
        position: "relative",
        "& .MuiSpeedDialIcon-icon":
          SelectedIcon || defaultIcon
            ? {
                transform: "none !important",
              }
            : {},
        "& .MuiSpeedDial-actions": {
          gap: theme => theme.spacing(2),
          position: "absolute",
          ...positionStyles(props.FabProps?.size ?? "medium", !!children)[props.direction ?? "up"],
          backgroundColor: theme => alpha(theme.palette.grey["800"], 0),
          transition: theme =>
            theme.transitions.create("backgroundColor", {
              duration: theme.transitions.duration.complex,
            }),
          "& > *:not(.MuiSpeedDialAction)": {
            transition: theme =>
              theme.transitions.create("opacity", {
                duration: theme.transitions.duration.complex,
              }),
            opacity: 0,
          },
        },
        "& .MuiSpeedDial-actions:not(.MuiSpeedDial-actionsClosed)": {
          backgroundColor: theme => theme.palette.grey["800"],
          "& > *:not(.MuiSpeedDialAction)": {
            opacity: 1,
          },
        },
      }}
    >
      {options
        ? options.map(opt => (
            <SpeedDialAction
              key={opt.value}
              {...(opt.Icon
                ? {
                    icon: <opt.Icon />,
                  }
                : {
                    children: opt.label,
                  })}
              onClick={() => {
                setValue(opt.value);
                setOpen(false);
              }}
              sx={{ margin: theme => theme.spacing(1) }}
              slotProps={{
                fab: {
                  component: ToggleButton,
                  // @ts-expect-error: props aren't inherited from `component` in slots
                  selected: opt.value === value,
                },
                tooltip: opt.Icon
                  ? {
                      title: opt.label,
                    }
                  : undefined,
              }}
            />
          ))
        : children}
    </SpeedDial>
  );
}
