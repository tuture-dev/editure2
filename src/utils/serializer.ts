import { MarkdownSerializer } from 'prosemirror-markdown';
import { backticksFor, isPlainURL } from './marks';

function createSerializer() {
  const nodes = {
    text: (state: any, node: any) => {
      state.text(node.text);
    },
    blockquote: (state: any, node: any) => {
      state.wrapBlock('> ', null, node, () => state.renderContent(node));
    },
    paragraph: (state: any, node: any) => {
      if (
        node.textContent.trim() === '' &&
        node.childCount === 0 &&
        !state.inTable
      ) {
        state.write('\\\n');
      } else {
        state.renderInline(node);
        state.closeBlock(node);
      }
    },
    heading: (state, node) => {
      state.write(state.repeat('#', node.attrs.level) + ' ');
      state.renderInline(node);
      state.closeBlock(node);
    },
    list_item: (state, node) => {
      state.renderContent(node);
    },
    bullet_list: (state, node) => {
      state.renderList(node, '  ', () => (node.attrs.bullet || '*') + ' ');
    },
    ordered_list: (state, node) => {
      const start = node.attrs.order || 1;
      const maxW = `${start + node.childCount - 1}`.length;
      const space = state.repeat(' ', maxW + 2);

      state.renderList(node, space, (i) => {
        const nStr = `${start + i}`;
        return state.repeat(' ', maxW - nStr.length) + nStr + '. ';
      });
    },
    hard_break(state: any, node: any, parent: any, index: any) {
      for (let i = index + 1; i < parent.childCount; i++) {
        if (parent.child(i).type != node.type) {
          state.write('\\\n');
          return;
        }
      }
    },
  };

  const marks = {
    em: {
      open: '*',
      close: '*',
      mixable: true,
      expelEnclosingWhitespace: true,
    },
    strong: {
      open: '**',
      close: '**',
      mixable: true,
      expelEnclosingWhitespace: true,
    },
    underline: {
      open: '__',
      close: '__',
      mixable: true,
      expelEnclosingWhitespace: true,
    },
    strikethrough: {
      open: '~~',
      close: '~~',
      mixable: true,
      expelEnclosingWhitespace: true,
    },
    code: {
      open(_state: any, _mark: any, parent: any, index: any) {
        return backticksFor(parent.child(index), -1);
      },
      close(_state: any, _mark: any, parent: any, index: any) {
        return backticksFor(parent.child(index - 1), 1);
      },
      escape: false,
    },
    link: {
      open(_state, mark, parent, index) {
        return isPlainURL(mark, parent, index, 1) ? '<' : '[';
      },
      close(state, mark, parent, index) {
        return isPlainURL(mark, parent, index, -1)
          ? '>'
          : '](' +
              state.esc(mark.attrs.href) +
              (mark.attrs.title ? ' ' + state.quote(mark.attrs.title) : '') +
              ')';
      },
    },
  };

  return new MarkdownSerializer(nodes, marks);
}

export default createSerializer;
