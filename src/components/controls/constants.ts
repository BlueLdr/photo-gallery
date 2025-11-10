import { styled } from "@mui/material/styles";

import { ImageGalleryLayout } from "~/utils";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ViewSidebarRoundedIcon from "@mui/icons-material/ViewSidebarRounded";

import type { ControlOption } from "./types";

//================================================

const CarouselRoundedIcon = styled(ViewSidebarRoundedIcon)`
  transform: rotate(90deg);
`;

export const LAYOUT_OPTIONS = [
  { value: ImageGalleryLayout.Grid, label: "Grid", Icon: GridViewRoundedIcon },
  { value: ImageGalleryLayout.Carousel, label: "Carousel", Icon: CarouselRoundedIcon },
  { value: ImageGalleryLayout.Masonry, label: "Masonry", Icon: DashboardRoundedIcon },
] satisfies ControlOption<ImageGalleryLayout>[];
