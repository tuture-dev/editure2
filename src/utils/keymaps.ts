import { Keymap, toggleMark } from 'prosemirror-commands';
import { redo, undo } from 'prosemirror-history';
import schema from './schema';

function createKeymaps() {
  let keys: Keymap<any> = {},
    type;

  function bind(key: any, cmd: any) {
    keys[key] = cmd;
  }

  bind('Mod-z', undo);
  bind('Shift-Mod-z', redo);

  // 下面的快捷键都有待近一步优化，目前先参考 outline 的实现
  if ((type = schema.marks.strong)) {
    bind('Mod-b', toggleMark(type));
    bind('Mod-B', toggleMark(type));
  }

  if ((type = schema.marks.em)) {
    bind('Mod-i', toggleMark(type));
    bind('Mod-I', toggleMark(type));
  }

  if ((type = schema.marks.underline)) {
    bind('Mod-u', toggleMark(type));
  }

  if ((type = schema.marks.strikethrough)) {
    bind('Mod-d', toggleMark(type));
  }

  // code keymaps
  if ((type = schema.marks.code)) {
    bind('Mod-e', toggleMark(type));
  }

  return keys;
}

export default createKeymaps;
