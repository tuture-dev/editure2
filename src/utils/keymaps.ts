import { Keymap, toggleMark, setBlockType } from 'prosemirror-commands';
import { redo, undo } from 'prosemirror-history';
import schema from './schema';
import { toggleWrap, toggleList } from './nodes';
import {
  liftListItem,
  sinkListItem,
  splitListItem,
} from 'prosemirror-schema-list';

function createKeymaps() {
  let keys: Keymap<any> = {},
    type;

  function bind(key: any, cmd: any) {
    keys[key] = cmd;
  }

  // Undo/Redo
  bind('Mod-z', undo);
  bind('Shift-Mod-z', redo);

  // 下面的快捷键都有待近一步优化，目前先参考 outline 的实现
  // Strong
  if ((type = schema.marks.strong)) {
    bind('Mod-b', toggleMark(type));
    bind('Mod-B', toggleMark(type));
  }

  // Em
  if ((type = schema.marks.em)) {
    bind('Mod-i', toggleMark(type));
    bind('Mod-I', toggleMark(type));
  }

  // Underline
  if ((type = schema.marks.underline)) {
    bind('Mod-u', toggleMark(type));
  }

  // Strikethrough
  if ((type = schema.marks.strikethrough)) {
    bind('Mod-d', toggleMark(type));
  }

  // Code
  if ((type = schema.marks.code)) {
    bind('Mod-e', toggleMark(type));
  }

  // Link
  if ((type = schema.marks.link)) {
    bind('Mod-k', (state, dispatch) => {
      if (state.selection.empty) {
        return true;
      }

      return toggleMark(type, { href: '' })(state, dispatch);
    });
  }

  // Heading
  if ((type = schema.nodes.heading)) {
    for (let i = 1; i <= 6; i++)
      bind(`Shift-Ctrl-${i}`, setBlockType(type, { level: i }));
  }

  // Paragraph
  if ((type = schema.nodes.paragraph)) {
    bind(`Shift-Ctrl-0`, setBlockType(type));
  }

  // Blockquote
  // keymap 值得商榷
  if ((type = schema.nodes.blockquote)) {
    bind('Ctrl->', toggleWrap(type));
    bind('Mod-]', toggleWrap(type));
  }

  // ListItem
  if ((type = schema.nodes.list_item)) {
    bind('Enter', splitListItem(type));
    bind('Tab', sinkListItem(type));
    bind('Shift-Tab', liftListItem(type));
    bind('Mod-]', sinkListItem(type));
    bind('Mod-[', liftListItem(type));
  }

  // BulletList
  if ((type = schema.nodes.bullet_list)) {
    bind('Shift-Ctrl-8', toggleList(type, schema.nodes.list_item));
  }

  return keys;
}

export default createKeymaps;
