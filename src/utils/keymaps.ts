import { Keymap, toggleMark } from 'prosemirror-commands';
import schema from './schema';

function createKeymaps() {
  let keys: Keymap<any> = {},
    type;

  function bind(key: any, cmd: any) {
    keys[key] = cmd;
  }

  // code keymaps
  if ((type = schema.marks.code)) {
    bind('Mod-e', toggleMark(type));
  }

  return keys;
}

export default createKeymaps;
