import loadImage from "blueimp-load-image";

import { ExifOrientation, ExifOrientationRotationMap } from "../constants";

import type { Tags, XmpTag, XmpTags } from "exifreader";

//================================================

export const isExifOrientation = (value: number): value is ExifOrientation =>
  [
    ExifOrientation.None,
    ExifOrientation.Rotate90Clockwise,
    ExifOrientation.Rotate180,
    ExifOrientation.Rotate270Clockwise,
  ].includes(value);

export const parseStringTagValue = (
  tag:
    | {
        value: string | number | unknown;
        description: string;
      }
    | undefined,
  separator = ", ",
) => {
  if (!tag) {
    return undefined;
  }
  if (typeof tag.value === "number") {
    return `${tag.value}`;
  }
  if (typeof tag.value === "string") {
    return tag.value;
  }
  if (Array.isArray(tag.value) && tag.value.every(v => typeof v === "string")) {
    return tag.value.join(separator);
  }
  return undefined;
};

export const parseNumberTagValue = (
  tag:
    | {
        value: string | number | unknown;
        description: string;
      }
    | undefined,
) => {
  if (!tag) {
    return undefined;
  }
  if (typeof tag.value === "number") {
    return tag.value;
  }
  if (typeof tag.value === "string" && !isNaN(Number(tag.value))) {
    return Number(tag.value);
  }
  return undefined;
};

//================================================

export const getImageThumbnailDataUri = async (
  tags: Pick<Tags, "Thumbnail" | "Image Type" | "AutoRotate" | "Orientation" | "Image Orientation">,
  fileType: string = `image/${tags["Image Type"]?.value}`,
) => {
  if (!tags.Thumbnail) {
    return undefined;
  }
  const uri = `data:${fileType};base64,${tags.Thumbnail.base64}`;
  const rotation = getRotation(tags);
  if (rotation === 0) {
    return uri;
  }
  const img = await loadImage(uri, { orientation: ExifOrientationRotationMap[rotation] });
  if (img.image instanceof HTMLImageElement) {
    return img.image.src;
  } else if (img.image instanceof HTMLCanvasElement) {
    return img.image.toDataURL(fileType);
  }
};

export const getOriginalDate = (tags: Pick<Tags, "DateTimeOriginal" | "OffsetTimeOriginal">) => {
  if (!tags.DateTimeOriginal?.value) {
    return null;
  }
  return new Date(`${tags.DateTimeOriginal?.value} ${tags.OffsetTimeOriginal?.value ?? ""}`);
};

export const getRotation = (
  input: Pick<Tags, "AutoRotate" | "Orientation" | "Image Orientation">,
) => {
  const tags = [input.AutoRotate, input.Orientation, input["Image Orientation"]];

  for (const tag of tags) {
    const match = tag?.description?.match(/Rotate (90|180|270)/i);
    if (match && !isNaN(Number(match[1]))) {
      return Number(match[1]) as 90 | 180 | 270;
    }
    if (typeof tag?.value === "number" && isExifOrientation(tag.value)) {
      return ExifOrientationRotationMap[tag.value];
    }
  }

  return 0 as const;
};

export const getRating = (tags: XmpTags) =>
  parseNumberTagValue(tags.Rating) ?? parseNumberTagValue(tags.rating);

//================================================

export const EXIF_CATEGORY_PROPERTIES = [
  "hierarchicalSubject",
  "TagsList",
  "CatalogSets",
  "LastKeywordXMP",
] as const;
export type ExifCategoryProperty =
  typeof EXIF_CATEGORY_PROPERTIES extends Readonly<Array<infer T>> ? T : never;

export const getRawCategories = (tags: XmpTags) => {
  const tagLists: (XmpTag & { value: XmpTag[] })[] = [];
  const tagStrings: string[] = [];

  for (const key of EXIF_CATEGORY_PROPERTIES) {
    const tag = tags[key];
    if (!tag) {
      continue;
    }
    if (typeof tag.value === "string") {
      tagStrings.push(tag.value);
    } else if (Array.isArray(tag.value)) {
      if (tag.value.every(item => item.value && typeof item.value === "string")) {
        return tag.value.map(item => item.value as string);
      }
      tagLists.push(tag as XmpTag & { value: XmpTag[] });
    }
  }

  for (const tag of tagLists) {
    const categories: string[] = [];
    for (const item of tag.value) {
      if (item.value && typeof item.value === "string") {
        categories.push(item.value);
      } else if (item.description) {
        categories.push(item.description);
      } else {
        break;
      }
    }
    if (categories.length === tag.value.length) {
      return categories;
    }
  }

  return (
    tagStrings
      ?.find(str => /^(["']?).+?\1(, (\1.+?\1))*$/i.test(str) || /^([^,]+?)(, [^,]+?)*$/i.test(str))
      ?.split(", ")
      ?.map(str => str.replace(/^(["'])(.+)\1$/, "$2")) ?? []
  );
};
