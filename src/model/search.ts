import createFuzzySearch from "@nozbe/microfuzz";

import type { ImageMetadata } from "~/model";

//================================================

export const getImageSearchText = (image: ImageMetadata) => [
  ...image.meta.keywords,
  image.meta.tags.join(" "),
];
export const createFuzzyImageSearch = (images: ImageMetadata[]) =>
  createFuzzySearch(images, {
    getText: getImageSearchText,
  });
