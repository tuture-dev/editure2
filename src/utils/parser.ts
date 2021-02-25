import { MarkdownParser } from 'prosemirror-markdown';
import markdownit from 'markdown-it';
import schema from './schema';

function createParser() {
  const tokens = {
    strong: {
      mark: 'strong',
    },
    em: {
      mark: 'em',
    },
    underline: {
      mark: 'u',
    },
    strikethrough: {
      mark: 'strikethrough',
    },
    code_inline: {
      mark: 'code',
      noCloseToken: true,
    },
    link: {
      mark: 'link',
      getAttrs: (tok) => ({
        href: tok.attrGet('href'),
        title: tok.attrGet('title') || null,
      }),
    },
    paragraph: {
      block: 'paragraph',
    },
    heading: {
      block: 'heading',
      getAttrs: (token) => ({ level: +token.tag.slice(1) }),
    },
    blockquote: {
      block: 'blockquote',
    },
    list_item: {
      block: 'list_item',
    },
    bullet_list: {
      block: 'bullet_list',
    },
    ordered_list: {
      block: 'ordered_list',
    },
    hardbreak: { node: 'hard_break' },
  };

  return new MarkdownParser(
    schema,
    markdownit('commonmark', { html: false }),
    tokens,
  );
}

export default createParser;
