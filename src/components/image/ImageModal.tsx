import { useModalTarget } from "~/utils";

import { ImageView } from "./ImageView";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

import type { ImageMetadata } from "~/model";
import type { ImageOverlayOptions } from "./ImageOverlay";

//================================================

export type ImageModalProps = {
  image: ImageMetadata | undefined;
  closeModal: () => void;
  overlay?: Omit<ImageOverlayOptions, "onClose">;
};

export function ImageModal({ image: target, closeModal, overlay }: ImageModalProps) {
  const [open, image, TransitionProps] = useModalTarget(target);

  return (
    <Dialog
      maxWidth={false}
      open={open}
      onKeyDown={
        open
          ? e => {
              if (e.key === "ArrowLeft") {
                overlay?.onClickPrev?.();
              }
              if (e.key === "ArrowRight") {
                overlay?.onClickNext?.();
              }
            }
          : undefined
      }
      slotProps={{
        transition: TransitionProps,
        paper: {
          sx: {
            position: "relative",
            height: "100%",
            maxHeight: theme => `calc(100vh - ${theme.spacing(8)})`,
          },
        },
      }}
      onClose={closeModal}
    >
      <DialogContent
        sx={{
          maxHeight: "100%",
          height: "100%",
          width: "100%",
          boxSizing: "border-box",
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        {image && (
          <ImageView
            data={image}
            maxWidth="100%"
            maxHeight="100%"
            height="100%"
            sx={{ objectFit: "contain" }}
            autoFocus
            tabIndex={0}
            containerStyle={{
              display: "grid",
              height: "100%",
              width: "100%",
              gridTemplateRows: "minmax(0, 1fr)",
              alignItems: "center",
            }}
            overlay={{
              onClose: closeModal,
              ...overlay,
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
