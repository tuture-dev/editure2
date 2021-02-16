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
    paragraph: {
      block: 'paragraph',
    },
    hark_break: { node: 'hard_break' },
  };

  return new MarkdownParser(
    schema,
    markdownit('commonmark', { html: false }),
    tokens,
  );
}

export default createParser;
