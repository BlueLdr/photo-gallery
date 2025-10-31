import type * as ExifReader from "exifreader";
import type { FileMetaDbEntry } from "~/db";

//================================================

export interface ImageMetadata {
  tags: ExifReader.Tags;
  meta: FileMetaDbEntry;
  thumbnailSrc?: string;
  src: string;
}
