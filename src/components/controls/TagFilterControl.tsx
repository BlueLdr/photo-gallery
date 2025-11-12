import { RichTreeView } from "@mui/x-tree-view";
import { useRef } from "react";

import { FilterMode, ImageTag } from "~/model";
import { enumValues } from "~/utils";

import { capitalize } from "@mui/material/utils";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import type { ValueAndSetter } from "~/utils";
import type { RichTreeViewApiRef } from "@mui/x-tree-view";

//================================================

type TreeItemData = {
  id: string;
  label: string;
  children?: TreeItemData[];
};
const createTreeItemForTag = (tag: ImageTag): TreeItemData => ({
  id: tag.id,
  label: tag.name,
  children: tag.children.length ? tag.children.map(createTreeItemForTag) : undefined,
});

export type TagFilterControlProps = ValueAndSetter<"tags", ImageTag[]> &
  ValueAndSetter<"mode", FilterMode | undefined>;

export function TagFilterControl({ tags, setTags, mode, setMode }: TagFilterControlProps) {
  const allTags = ImageTag.getAllTags();
  const items: TreeItemData[] = allTags.filter(tag => !tag.parent).map(createTreeItemForTag);

  const apiRef: RichTreeViewApiRef = useRef(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Grid
      ref={containerRef}
      container
      direction="column"
      gap={theme => theme.spacing(3)}
      position="relative"
    >
      <Select
        size="small"
        value={mode}
        onChange={e => setMode(e.target.value)}
        renderValue={value => `Match ${value}`}
        MenuProps={{ container: () => containerRef.current }}
      >
        {enumValues(FilterMode).map(value => (
          <MenuItem key={value} value={value}>
            {capitalize(value)}
          </MenuItem>
        ))}
      </Select>
      <RichTreeView
        apiRef={apiRef}
        items={items}
        checkboxSelection
        multiSelect
        selectedItems={tags.map(tag => tag.id)}
        // onItemSelectionToggle={onToggleItem}
        onSelectedItemsChange={(_, values) => {
          setTags(allTags.filter(tag => values.includes(tag.id)));
        }}
        onItemClick={(event, itemId) => {
          if (
            event.target instanceof HTMLElement &&
            (event.target.classList.contains("MuiTreeItem-content") ||
              event.target.classList.contains("MuiTreeItem-label")) &&
            !apiRef.current?.getItemOrderedChildrenIds?.(itemId)?.length
          ) {
            apiRef.current?.setItemSelection?.({
              itemId,
              event,
              keepExistingSelection: true,
              shouldBeSelected: !tags.some(tag => tag.id === itemId),
            });
          }
        }}
        selectionPropagation={{
          parents: true,
          descendants: true,
        }}
      />
    </Grid>
  );
}
