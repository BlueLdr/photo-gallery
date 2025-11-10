import { alpha } from "@mui/material/styles";

import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";

import type { BoxProps } from "@mui/material/Box";
import type { ImageMetadata } from "~/model";
import type { WithOverrides } from "~/utils";

//================================================

export type ImageOverlayProps = WithOverrides<
  BoxProps,
  {
    image: ImageMetadata;
    onClose?: () => void;
    visible?: boolean;
    onClickNext?: () => void;
    onClickPrev?: () => void;
    loading?: boolean;
  }
>;

export function ImageOverlay({
  onClose,
  visible = true,
  image,
  loading,
  onClickNext,
  onClickPrev,
  ...props
}: ImageOverlayProps) {
  return (
    <Box
      position="absolute"
      width="100%"
      height="100%"
      top={0}
      left={0}
      {...props}
      sx={{
        display: "grid",
        gridTemplateAreas: '"header header header" "prev image next" "footer footer footer"',
        gridTemplateColumns: "minmax(25%, 64px) 1fr minmax(25%, 64px)",
        gridTemplateRows: "minmax(0, auto) 1fr minmax(0, auto)",
        "& > *": {
          zIndex: 20,
          opacity: visible ? 1 : 0,
          transition: theme => theme.transitions.create("opacity"),
          "&:hover": {
            opacity: 1,
          },
        },
        ...props.sx,
      }}
    >
      {onClose && (
        <Box gridArea="header" m={2} justifySelf="flex-end">
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      {loading && (
        <Box gridArea="image" display="flex" justifyContent="center" alignItems="center">
          <CircularProgress variant="indeterminate" />
        </Box>
      )}

      {onClickPrev && (
        <Box
          gridArea="prev"
          onClick={onClickPrev}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            cursor: "pointer",
            pl: 2,
            transition: theme => theme.transitions.create(["opacity", "background"]),
            "&:hover": {
              background: theme =>
                `radial-gradient(farthest-side at 0 50%, ${alpha(theme.palette.background.default, 0.6)}, ${alpha(theme.palette.background.default, 0)})`,
            },
          }}
        >
          <ChevronLeftIcon />
        </Box>
      )}
      {onClickNext && (
        <Box
          gridArea="next"
          onClick={onClickNext}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            cursor: "pointer",
            pr: 2,
            transition: theme => theme.transitions.create(["opacity", "background"]),
            "&:hover": {
              background: theme =>
                `radial-gradient(farthest-side at 100% 50%, ${alpha(theme.palette.background.default, 0.6)}, ${alpha(theme.palette.background.default, 0)})`,
            },
          }}
        >
          <ChevronRightIcon />
        </Box>
      )}
    </Box>
  );
}
