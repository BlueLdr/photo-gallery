export const loadAllFilesInSubdirectories = async (dir: FileSystemDirectoryEntry) =>
  new Promise<FileSystemFileEntry[]>((resolve, reject) => {
    dir.createReader().readEntries(
      async entries => {
        const results: FileSystemFileEntry[] = [];
        for (const entry of entries) {
          if (entry instanceof FileSystemFileEntry) {
            results.push(entry);
          } else if (entry instanceof FileSystemDirectoryEntry) {
            const subDirEntries = await loadAllFilesInSubdirectories(entry).catch(error => {
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

export const loadEntryFileAsync = async (entry: FileSystemFileEntry) =>
  new Promise<File>((resolve, reject) => {
    entry.file(resolve, reject);
  });
