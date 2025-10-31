import { keyframes } from "@emotion/react";
import { styled } from "@mui/material/styles";
import { useCallback, useEffect, useRef, useState } from "react";

import { hasValidFileExtension } from "~/utils";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

//================================================

const FileInput = styled("input", {
  shouldForwardProp() {
    return true;
  },
})`
  position: absolute;
  z-index: -9999;
  left: 0;
  top: 0;
  width: 1px;
  height: 1px;
  appearance: textfield;
  border: none;
  padding: 0;
  margin: 0;
`;

const WIGGLE_AMOUNT = 12;
const wiggle = keyframes`
  0% {
      transform: translateX(0px)
  }
  5% {
      transform: translateX(-${WIGGLE_AMOUNT}px)
  }
  20% {
      transform: translateX(${WIGGLE_AMOUNT}px);
  }
  38% {
      transform: translateX(-${WIGGLE_AMOUNT * 0.8}px);
  }
  58% {
      transform: translateX(${WIGGLE_AMOUNT * 0.6}px);
  }
  80% {
      transform: translateX(-${WIGGLE_AMOUNT * 0.3}px);
  }
  100% {
      transform: translateX(0px);
  }
`;

export type UploadBoxProps = {
  setDataTransfer: React.Dispatch<React.SetStateAction<DataTransfer | undefined>>;
  setFiles: React.Dispatch<React.SetStateAction<(FileSystemFileEntry | File)[] | undefined>>;
  reset: () => void;
};

export function UploadBox({ setDataTransfer, reset, setFiles }: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hovered, setHovered] = useState(false);
  const [invalidUpload, setInvalidUpload] = useState(false);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      setHovered(false);
      e.preventDefault();
      const dir = e.dataTransfer?.items[0].webkitGetAsEntry();
      if (dir instanceof FileSystemDirectoryEntry) {
        reset();
        setDataTransfer(e.dataTransfer);
      } else {
        setInvalidUpload(true);
      }
    },
    [reset],
  );

  useEffect(() => {
    if (hovered) {
      setInvalidUpload(false);
    }
  }, [hovered]);

  return (
    <Container
      component={Grid}
      container
      direction="column"
      height="80vh"
      alignItems="center"
      justifyContent="center"
      border="8px dashed"
      borderRadius="1rem"
      sx={{
        animation: invalidUpload && !hovered ? `${wiggle} 400ms ease-in-out` : undefined,
        cursor: "pointer",
      }}
      onClick={() => inputRef.current?.click()}
      onDragEnter={() => setHovered(true)}
      onDragLeave={() => setHovered(false)}
      onDragOver={e => {
        setHovered(true);
        e.preventDefault();
      }}
      onDropCapture={onDrop}
      {...(hovered
        ? {
            borderColor: "primary.light",
            bgcolor: "primary.dark",
          }
        : {
            borderColor: "divider",
          })}
    >
      <Grid
        container
        onDragEnterCapture={e => e.preventDefault()}
        direction="column"
        alignItems="center"
        gap={2}
      >
        <Typography variant="subtitle2">
          <br />
        </Typography>
        <Typography variant="h5">Drag and drop a folder of photos here,</Typography>
        <Typography variant="h5">or click to upload a folder</Typography>

        <Typography variant="subtitle2" color="error">
          {invalidUpload ? "Invalid file" : <br />}
        </Typography>
      </Grid>
      <FileInput
        ref={inputRef}
        type="file"
        {...{ webkitdirectory: "true", directory: "true", multiple: true }}
        onChange={e => {
          if (!e.target.files) {
            return;
          }
          const validFiles = Array.from(e.target.files).filter(file =>
            hasValidFileExtension(file.name),
          );
          if (validFiles.length > 0) {
            setFiles(validFiles);
          } else {
            setInvalidUpload(true);
          }
        }}
      />
    </Container>
  );
}
