import * as ExifReader from "exifreader";

import { getDbEntryFromFileAndTags } from "~/db";
import { getFilePath, getImageThumbnailDataUri, loadEntryFileAsync, promiseAll } from "~/utils";
import { ImageTag } from "~/model";

import type { ImageMetadata } from "~/model";
import type { ApiResponse } from "~/utils";

//================================================

export const loadImageData = (entry: FileSystemFileEntry | File) =>
  loadEntryFileAsync(entry)
    .then(async file =>
      ExifReader.load(file, { length: 128 * 1024, async: true, includeUnknown: true }).then(
        tags => {
          const meta = getDbEntryFromFileAndTags(file, tags);
          return getImageThumbnailDataUri(tags, meta.mimeType).then(
            (thumbnailUrl): ApiResponse<ImageMetadata> => ({
              data: {
                tags,
                meta: {
                  ...meta,
                  tags: ImageTag.fromRawCategories(meta.rawCategories),
                },
                thumbnailSrc: thumbnailUrl,
                src: URL.createObjectURL(file),
              },
              error: undefined,
            }),
          );
        },
      ),
    )
    .catch(error => {
      console.error(`Failed to load image data for file "${getFilePath(entry)}": `, error);
      return { data: null, error };
    });

export const bulkLoadImageData = (
  files: (FileSystemFileEntry | File)[],
  setLoadedCount: React.Dispatch<React.SetStateAction<number>>,
): Promise<ApiResponse<ImageMetadata[]>> =>
  promiseAll(
    files.map(file =>
      loadImageData(file).then(data => {
        setLoadedCount(count => count + 1);
        return data;
      }),
    ),
  ).then(result => {
    if (result.data) {
      return { data: Object.values(result.data), error: undefined };
    }
    return result;
  });
