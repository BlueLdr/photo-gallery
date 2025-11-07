import { RichTreeView } from "@mui/x-tree-view";
import { useRef } from "react";

import { ImageTag } from "~/model";

import type { RichTreeViewApiRef } from "@mui/x-tree-view";
import type { ValueAndSetter } from "~/utils";

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

export type TagFilterControlProps = ValueAndSetter<"tags", ImageTag[]>;

export function TagFilterControl({ tags, setTags }: TagFilterControlProps) {
  const allTags = ImageTag.getAllTags();
  const items: TreeItemData[] = allTags.filter(tag => !tag.parent).map(createTreeItemForTag);

  const apiRef: RichTreeViewApiRef = useRef(undefined);

  return (
    <RichTreeView
      apiRef={apiRef}
      items={items}
      checkboxSelection
      multiSelect
      selectedItems={tags.map(tag => tag.id)}
      // onItemSelectionToggle={onToggleItem}
      onSelectedItemsChange={(_, values) => {
        console.log(`values: `, values);
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
  );
}
