import { SUPPORTED_EXTENSIONS } from "~/utils";

//================================================

export const loadAllFilesInSubdirectories = async (
  dir: FileSystemDirectoryEntry,
  allowedExtensions: string[] = [],
) =>
  new Promise<FileSystemFileEntry[]>((resolve, reject) => {
    dir.createReader().readEntries(
      async entries => {
        const results: FileSystemFileEntry[] = [];
        for (const entry of entries) {
          if (
            entry instanceof FileSystemFileEntry &&
            (!allowedExtensions.length || hasValidFileExtension(entry.name, allowedExtensions))
          ) {
            results.push(entry);
          } else if (entry instanceof FileSystemDirectoryEntry) {
            const subDirEntries = await loadAllFilesInSubdirectories(
              entry,
              allowedExtensions,
            ).catch(error => {
              reject(error);
              return null;
            });
            if (!subDirEntries) {
              return;
            }
            results.push(...subDirEntries);
          }
        }
        return resolve(results);
      },
      error => {
        reject(error);
      },
    );
  });

export const loadEntryFileAsync = async (entry: FileSystemFileEntry | File) =>
  new Promise<File>((resolve, reject) => {
    return entry instanceof File ? resolve(entry) : entry.file(resolve, reject);
  });

export const getFilePath = (file: FileSystemFileEntry | File) =>
  file instanceof File ? file.webkitRelativePath : file.fullPath;

export const hasValidFileExtension = (fileName: string, extensions = SUPPORTED_EXTENSIONS) =>
  extensions.some(ext => fileName.toLowerCase().endsWith(ext.toLowerCase()));
