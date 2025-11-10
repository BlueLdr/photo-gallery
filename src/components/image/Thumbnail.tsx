import { styled } from "@mui/material/styles";

//================================================

const ThumbnailImg = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  size,
  ...props
}: React.ComponentProps<"img"> & { size?: number | "auto"; block?: boolean }) => (
  <img loading="lazy" {...props} />
);

export const Thumbnail = styled(ThumbnailImg)`
  width: ${({ size = "auto" }) => (size === "auto" ? "auto" : `${size}px`)};
  height: ${({ size = "auto" }) => (size === "auto" ? "auto" : `${size}px`)};
  object-fit: cover;
  ${({ block }) => (block ? `display: block;` : "")}
`;
