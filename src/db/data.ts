import { getOriginalDate, getRating, getRawCategories, getRotation } from "~/utils";

import type { Tags } from "exifreader";
import type { FileMetaDbEntry } from "~/db/types";

//================================================

export const getDbEntryFromFileAndTags = (file: File, tags: Tags): FileMetaDbEntry => {
  const keywords = [];
  if (tags.Keywords) {
    if (Array.isArray(tags.Keywords)) {
      tags.Keywords.forEach(item => keywords.push(item.description));
    } else {
      keywords.push(tags.Keywords.description);
    }
  }

  const dateCreated = getOriginalDate(tags);

  return {
    filename: file.name,
    path: file.webkitRelativePath,
    mimeType: file.type,
    dateCreated: dateCreated?.getTime(),
    lastModified: file.lastModified,
    keywords,
    rawCategories: getRawCategories(tags),
    height: tags["Image Height"]?.value,
    width: tags["Image Width"]?.value,
    rating: getRating(tags),
    rotation: getRotation(tags),
  };
};
