import type { Tags } from "exifreader";

export const getImageThumbnailDataUri = (tags: Pick<Tags, "Thumbnail" | "Image Type">) =>
  tags.Thumbnail
    ? `data:image/${tags["Image Type"]?.value};base64,${tags.Thumbnail.base64}`
    : undefined;
