export enum ExifOrientation {
  None = 1,
  Rotate90Clockwise = 6,
  Rotate180 = 3,
  Rotate270Clockwise = 8,
}

export const ExifOrientationRotationMap: Record<ExifOrientation, 0 | 90 | 180 | 270> &
  Record<0 | 90 | 180 | 270, ExifOrientation> = {
  [ExifOrientation.None]: 0,
  [ExifOrientation.Rotate90Clockwise]: 90,
  [ExifOrientation.Rotate180]: 180,
  [ExifOrientation.Rotate270Clockwise]: 270,
  [0]: ExifOrientation.None,
  [90]: ExifOrientation.Rotate90Clockwise,
  [180]: ExifOrientation.Rotate180,
  [270]: ExifOrientation.Rotate270Clockwise,
};

export const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg"];

export const NULL_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export enum ImageGalleryLayout {
  Carousel = "carousel",
  Grid = "grid",
  Masonry = "masonry",
}

export enum ImageThumbnailSize {
  xs = 1,
  sm,
  md,
  lg,
  xl,
}
