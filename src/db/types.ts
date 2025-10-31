import type { Dexie, EntityTable } from "dexie";

//================================================

export interface FileMetaDbEntry {
  filename: string;
  path: string;
  mimeType: string;
  dateCreated?: number | undefined;
  lastModified: number;
  keywords: string[];
  rawCategories: string[];
  width?: number;
  height?: number;
  rating?: number;
  rotation: 0 | 90 | 180 | 270;
}

export interface FileMetaCollectionDbTables {
  files: EntityTable<FileMetaDbEntry, "path">;
}

export interface FileMetaCollectionDb extends Dexie, FileMetaCollectionDbTables {}
