import { useCallback, useEffect, useRef, useState } from "react";

import { bulkLoadImageData, loadAllFilesInSubdirectories, SUPPORTED_EXTENSIONS } from "~/utils";

import { UploadBox } from "./UploadBox";
import { Album } from "../album";

import Grid from "@mui/material/Grid";

import type { ImageMetadata } from "~/model";
import type { ApiResponse } from "~/utils";

//================================================

export function HomePage() {
  const [dataTransfer, setDataTransfer] = useState<DataTransfer>();
  const startedLoadingFiles = useRef(false);
  const startedLoadingData = useRef(false);

  const [title, setTitle] = useState<string>();
  const [files, setFiles] = useState<(FileSystemFileEntry | File)[]>();
  const [loadedCount, setLoadedCount] = useState(0);
  const [imageDataPromise, setImageDataPromise] = useState<Promise<ApiResponse<ImageMetadata[]>>>();

  const reset = useCallback(() => {
    setDataTransfer(undefined);
    setTitle(undefined);
    setFiles(undefined);
    setImageDataPromise(undefined);
    setLoadedCount(0);
    startedLoadingFiles.current = false;
    startedLoadingData.current = false;
  }, []);

  useEffect(() => {
    const dir = dataTransfer?.items[0].webkitGetAsEntry();
    if (dir instanceof FileSystemDirectoryEntry && !startedLoadingFiles.current) {
      setTitle(dir.name);
      startedLoadingFiles.current = true;
      loadAllFilesInSubdirectories(dir, SUPPORTED_EXTENSIONS).then(files => {
        startedLoadingData.current = false;
        setFiles(files);
      });
    }
    return reset;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTransfer]);

  useEffect(() => {
    if (files && !startedLoadingData.current) {
      startedLoadingData.current = true;
      setImageDataPromise(bulkLoadImageData(files, setLoadedCount));
    }
  }, [files]);

  if (files && imageDataPromise) {
    return (
      <Album
        imageData={imageDataPromise}
        loadedCount={loadedCount}
        totalCount={files.length}
        reset={reset}
        title={title}
      />
    );
  }

  return (
    <Grid
      container
      direction="column"
      width="100%"
      height="100%"
      alignItems="center"
      justifyContent="center"
      gap={8}
    >
      <UploadBox setDataTransfer={setDataTransfer} setFiles={setFiles} reset={reset} />
    </Grid>
  );
}
