export class ImageTag {
  protected constructor(raw: string, parent?: ImageTag) {
    const [name, children] = ImageTag.parseRawCategoryString(raw);
    this.name = name;
    this.value = ImageTag.getChildFullRawString(name, parent);
    ImageTag.allTagsMap.set(this.value, this);
    this._children = new Set();
    if (children) {
      this._children.add(ImageTag.fromRawInternal(children, this));
    }
    this._parent = parent;
    parent?._children.add(this);
  }

  public static readonly fromRawCategories = (rawCategories: string[]) =>
    rawCategories.map(this.fromRawCategory);

  public static readonly fromRawCategory = (raw: string): ImageTag => {
    const [root, children] = ImageTag.parseRawCategoryString(raw);
    let tag = ImageTag.allTagsMap.get(root);
    if (!tag) {
      tag = new ImageTag(raw);
    }
    if (!children) {
      return tag;
    }
    return this.fromRawInternal(children, tag);
  };
  protected static readonly fromRawInternal = (raw: string, parent?: ImageTag): ImageTag => {
    const [root, children] = this.parseRawCategoryString(raw);
    let tag = this.allTagsMap.get(this.getChildFullRawString(root, parent));
    if (!tag) {
      tag = new ImageTag(raw, parent);
    }
    if (!children) {
      return tag;
    }
    return this.fromRawInternal(children, tag);
  };

  protected static readonly getChildFullRawString = (
    childName: string,
    parent?: ImageTag,
  ): string =>
    [parent ? ImageTag.getChildFullRawString(parent.name, parent.parent) : undefined, childName]
      .filter(str => !!str)
      .join(ImageTag.separatorChars[0]);

  public static readonly separatorChars = ["|", "/"];
  public static readonly parseRawCategoryString = (raw: string): [name: string, child?: string] => {
    for (const char of this.separatorChars) {
      const match = raw.match(new RegExp(`^([^\\${char}]+)\\${char}(.+)$`, "i"));
      if (match) {
        const [, name, children] = match;
        return [name, children];
      }
    }
    return [raw];
  };

  private static readonly allTagsMap = new Map<string, ImageTag>();
  static readonly getAllTags = () => {
    return Array.from(this.allTagsMap.values());
  };

  readonly value: string;
  readonly name: string;
  get id() {
    return this.value;
  }

  private _children: Set<ImageTag>;
  get children() {
    return Array.from(this._children);
  }

  private _parent?: ImageTag;
  get parent() {
    return this._parent;
  }

  toString = () => {
    return this.name;
  };

  getChildrenFlat = (includeParents?: boolean): ImageTag[] => {
    return this.children.reduce((arr, child) => {
      const children = child.getChildrenFlat();
      if (includeParents && children.length) {
        return [...arr, child, ...children];
      }
      return [...arr, ...children];
    }, [] as ImageTag[]);
  };
}
