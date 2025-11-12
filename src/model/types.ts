import type * as ExifReader from "exifreader";
import type { FileMetaDbEntry } from "~/db";
import type { ImageTag } from "./tag";

//================================================

export interface ImageFileMetadata extends FileMetaDbEntry {
  tags: ImageTag[];
}

export interface ImageMetadata {
  tags: ExifReader.Tags;
  meta: ImageFileMetadata;
  thumbnailSrc?: string;
  src: string;
}

export type FilterState = {
  tags?: ImageTag[];
  mode?: FilterMode;
};

export enum FilterMode {
  Any = "any",
  All = "all",
  None = "none",
}
