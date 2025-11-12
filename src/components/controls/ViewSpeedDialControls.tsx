import { useContext, useRef } from "react";

import { ViewContext } from "~/context";

import { LAYOUT_OPTIONS } from "./constants";
import { ControlBar } from "./ControlBar";
import { SearchFilterControl } from "./SearchFilterControl";
import { SizeControl } from "./SizeControl";
import { SpeedDialSelector } from "./SpeedDialSelector";
import { TagFilterControl } from "./TagFilterControl";

import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import PhotoSizeSelectLargeIcon from "@mui/icons-material/PhotoSizeSelectLarge";
import FilterIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import Badge from "@mui/material/Badge";

import type { FilterMode, ImageTag } from "~/model";
import type { FabProps } from "@mui/material/Fab";

//================================================

const commonFabProps: FabProps = {
  size: "medium",
  sx: {
    '&:not(:hover):not(:active):not(.Mui-focused):not(:focus)[aria-expanded="false"]': {
      boxShadow: "none",
    },
  },
};

export type ViewSpeedDialControlsProps = Pick<FabProps, "color"> & {
  direction: "left" | "right";
};

export function ViewSpeedDialControls({ color, direction }: ViewSpeedDialControlsProps) {
  const { layout, setLayout, size, setSize, search, setSearch, filters, setFilters } =
    useContext(ViewContext);
  const fabProps = { ...commonFabProps, color };

  const inputRef = useRef<HTMLInputElement>(null);

  const setTags = (newTags: ImageTag[]) => setFilters(state => ({ ...state, tags: newTags }));
  const setMode = (newMode?: FilterMode) => setFilters(state => ({ ...state, mode: newMode }));

  return (
    <ControlBar direction="vertical" color={color}>
      <SpeedDialSelector
        ariaLabel="Image gallery layout"
        options={LAYOUT_OPTIONS}
        defaultIcon={<GridViewRoundedIcon />}
        value={layout}
        setValue={setLayout}
        FabProps={fabProps}
        direction={direction}
      />
      <SpeedDialSelector
        ariaLabel="Image thumbnail size"
        defaultIcon={<PhotoSizeSelectLargeIcon />}
        FabProps={fabProps}
        direction={direction}
      >
        <SizeControl value={size} setValue={setSize} />
      </SpeedDialSelector>
      <SpeedDialSelector
        ariaLabel="Text search"
        defaultIcon={
          <Badge variant="dot" invisible={!search} color="primary">
            <SearchIcon />
          </Badge>
        }
        FabProps={fabProps}
        direction={direction}
        onOpen={() => inputRef.current?.focus()}
        sx={{ ".MuiSpeedDial-actions": { alignItems: "center" } }}
      >
        <SearchFilterControl
          value={search}
          setValue={setSearch}
          inputRef={inputRef}
          sx={{
            minWidth: theme => theme.spacing(64),
            marginInline: theme => theme.spacing(2),
            paddingBlock: theme => theme.spacing(0),
            "& input": {
              padding: theme => theme.spacing(1.5),
            },
          }}
          size="small"
          placeholder="Search images..."
        />
      </SpeedDialSelector>
      <SpeedDialSelector
        ariaLabel="Tag filters"
        defaultIcon={
          <Badge
            invisible={!filters.tags?.length}
            color="primary"
            badgeContent={filters.tags?.length}
          >
            <FilterIcon />
          </Badge>
        }
        FabProps={fabProps}
        direction={direction}
        sx={{
          "&.MuiSpeedDial-root > .MuiSpeedDial-actions": {
            alignItems: "flex-start",
            bottom: "unset",
            paddingBlock: theme => theme.spacing(4),
          },
        }}
      >
        <TagFilterControl
          tags={filters.tags ?? []}
          setTags={setTags}
          mode={filters.mode}
          setMode={setMode}
        />
      </SpeedDialSelector>
    </ControlBar>
  );
}
