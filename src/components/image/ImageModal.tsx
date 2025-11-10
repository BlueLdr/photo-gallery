import { useModalTarget } from "~/utils";

import { ImageView } from "./ImageView";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

import type { ImageMetadata } from "~/model";

//================================================

export type ImageModalProps = {
  image: ImageMetadata | undefined;
  closeModal: () => void;
  showNextImage?: () => void;
  showPrevImage?: () => void;
};

export function ImageModal({
  image: target,
  closeModal,
  showPrevImage,
  showNextImage,
}: ImageModalProps) {
  const [open, image, TransitionProps] = useModalTarget(target);

  return (
    <Dialog
      maxWidth={false}
      open={open}
      onKeyDown={
        open
          ? e => {
              console.log(`e.key: `, e.key);
              if (e.key === "ArrowLeft") {
                showPrevImage?.();
              }
              if (e.key === "ArrowRight") {
                showNextImage?.();
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
              onClickPrev: showPrevImage,
              onClickNext: showNextImage,
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
