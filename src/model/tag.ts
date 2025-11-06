export class ImageTag {
  protected constructor(raw: string, parent?: ImageTag) {
    this.raw = raw;
    const [root, children] = ImageTag.parseRawCategoryString(raw);
    this.root = root;
    ImageTag.allTagsMap.set(ImageTag.getChildFullRawString(root, parent), this);
    this._children = [];
    if (children) {
      this._children.push(ImageTag.fromRawInternal(children, this));
    }
    this._parent = parent;
    parent?._children.push(this);
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

  protected static readonly getChildFullRawString = (childRoot: string, parent?: ImageTag) =>
    [parent?.raw, childRoot].filter(str => !!str).join(ImageTag.separatorChars[0]);

  public static readonly separatorChars = ["|", "/"];
  public static readonly parseRawCategoryString = (raw: string): [root: string, child?: string] => {
    for (const char of this.separatorChars) {
      const match = raw.match(new RegExp(`^[^${char}]+${char}[^${char}]+`, "i"));
      if (match) {
        const [, root, children] = match;
        return [root, children];
      }
    }
    return [raw];
  };

  private static readonly allTagsMap = new Map<string, ImageTag>();
  static readonly getAllTags = () => {
    return Array.from(this.allTagsMap.values());
  };

  readonly raw: string;
  readonly root: string;

  private _children: ImageTag[];
  get children() {
    return this._children.slice();
  }

  private _parent?: ImageTag;
  get parent() {
    return this._parent;
  }

  toString = () => {
    return this.root;
  };
}
