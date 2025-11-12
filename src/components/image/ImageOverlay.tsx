import { alpha } from "@mui/material/styles";

import { SeparatedList } from "~/components/common";

import { getMetadataDisplayValue } from "./utils";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IconButton from "@mui/material/IconButton";

import type { BoxProps } from "@mui/material/Box";
import type { ImageMetadata } from "~/model";
import type { WithOverrides } from "~/utils";
import type { ImageDisplayableMetadataKey } from "./utils";

//================================================

export type ImageOverlayOptions = {
  onClose?: () => void;
  visible?: boolean;
  onClickNext?: () => void;
  onClickPrev?: () => void;
  loading?: boolean;
  index?: number;
  total?: number;
  meta?: Array<ImageDisplayableMetadataKey | ImageDisplayableMetadataKey[]>;
};

export type ImageOverlayProps = WithOverrides<
  BoxProps,
  ImageOverlayOptions & { image?: ImageMetadata }
>;

export function ImageOverlay({
  onClose,
  visible = true,
  image,
  loading,
  onClickNext,
  onClickPrev,
  index,
  total,
  meta,
  ...props
}: ImageOverlayProps) {
  const showMeta = !!meta?.length && image;
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
      {(onClose || showMeta) && (
        <Box
          display="flex"
          justifyContent={showMeta ? "space-between" : "flex-end"}
          sx={
            !!meta?.length && image
              ? {
                  backgroundColor: theme => alpha(theme.palette.common.black, 0.6),
                }
              : undefined
          }
          width="100%"
          gridColumn="span 3"
        >
          {showMeta && (
            <Box
              display="flex"
              justifyContent="flex-start"
              alignItems="flex-start"
              flexDirection="column"
              p={4}
              gap={2}
            >
              {meta.map((line, i) => (
                <Typography
                  {...(i === 0
                    ? {
                        component: "header",
                        variant: "subtitle1",
                      }
                    : {
                        variant: "body2",
                      })}
                >
                  {typeof line === "string" ? (
                    getMetadataDisplayValue(image.meta, line)
                  ) : (
                    <SeparatedList>
                      {line.map(key => getMetadataDisplayValue(image.meta, key))}
                    </SeparatedList>
                  )}
                </Typography>
              ))}
            </Box>
          )}
          <Box m={2} justifySelf="flex-end">
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
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
                `radial-gradient(farthest-side at 0 50%, ${alpha(theme.palette.background.default, 0.4)}, ${alpha(theme.palette.background.default, 0)})`,
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
                `radial-gradient(farthest-side at 100% 50%, ${alpha(theme.palette.background.default, 0.4)}, ${alpha(theme.palette.background.default, 0)})`,
            },
          }}
        >
          <ChevronRightIcon />
        </Box>
      )}

      {index != null && total != null && (
        <Box gridArea="footer" p={2} display="flex" alignItems="center" justifyContent="center">
          <Chip
            variant="filled"
            sx={{ backgroundColor: theme => alpha(theme.palette.common.black, 0.7) }}
            label={`${index + 1} / ${total}`}
          />
        </Box>
      )}
    </Box>
  );
}
