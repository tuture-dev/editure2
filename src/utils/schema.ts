import { Schema, NodeSpec, MarkSpec, Node } from 'prosemirror-model';

const nodes: { [name: string]: NodeSpec } = {
  doc: {
    content: 'block+',
  },
  paragraph: {
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM() {
      return ['p', 0];
    },
  },
  blockquote: {
    content: 'block+',
    group: 'block',
    parseDOM: [{ tag: 'blockquote' }],
    toDOM: () => ['blockquote', 0],
  },
  heading: {
    attrs: {
      level: {
        default: 1,
      },
    },
    content: 'inline*',
    group: 'block',
    defining: true,
    draggable: false,
    parseDOM: [
      { tag: 'h1', attrs: { level: 1 } },
      { tag: 'h2', attrs: { level: 2 } },
      { tag: 'h3', attrs: { level: 3 } },
      { tag: 'h4', attrs: { level: 4 } },
      { tag: 'h5', attrs: { level: 5 } },
      { tag: 'h6', attrs: { level: 6 } },
    ],
    toDOM: (node) => [`h${node.attrs.level}`, 0],
  },
  list_item: {
    content: 'paragraph block*',
    defining: true,
    draggable: true,
    parseDOM: [{ tag: 'li' }],
    toDOM: () => ['li', 0],
  },
  bullet_list: {
    content: 'list_item+',
    group: 'block',
    parseDOM: [{ tag: 'ul' }],
    toDOM: () => ['ul', 0],
  },
  text: {
    group: 'inline',
  },
  hard_break: {
    inline: true,
    group: 'inline',
    selectable: false,
    parseDOM: [{ tag: 'br' }],
    toDOM() {
      return ['br'];
    },
  },
};

const marks: { [name: string]: MarkSpec } = {
  strong: {
    parseDOM: [
      { tag: 'strong' },
      {
        tag: 'b',
        getAttrs: (node: any) => node?.style.fontWeight !== 'normal' && null,
      },
      {
        style: 'font-weight',
        getAttrs: (value: string) =>
          /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null,
      },
    ],
    toDOM: () => ['strong', 0],
  },
  em: {
    parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
    toDOM: () => ['em', 0],
  },
  underline: {
    parseDOM: [
      { tag: 'u' },
      {
        style: 'text-decoration',
        getAttrs: (value: string) => value === 'underline' && null,
      },
    ],
    toDOM: () => ['u', 0],
  },
  strikethrough: {
    parseDOM: [{ tag: 's' }, { tag: 'del' }, { tag: 'strike' }],
    toDOM: () => ['del', 0],
  },
  code: {
    parseDOM: [{ tag: 'code' }],
    // @ts-ignore
    toDOM: () => ['code'],
  },
  link: {
    attrs: {
      href: {
        default: '',
      },
    },
    inclusive: false,
    parseDOM: [
      {
        tag: 'a[href]',
        getAttrs: (dom: HTMLElement) => ({ href: dom.getAttribute('href') }),
      },
    ],
    toDOM: (node) => [
      'a',
      {
        ...node.attrs,
        rel: 'noopener noreferrer nofollow',
      },
      0,
    ],
  },
};

export default new Schema({
  marks,
  nodes,
});
