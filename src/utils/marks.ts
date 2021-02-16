export function isMarkActive(state: any, type: any) {
  let { from, $from, to, empty } = state.selection;
  if (empty) return type.isInSet(state.storedMarks || $from.marks());
  else return state.doc.rangeHasMark(from, to, type);
}

export function backticksFor(node: any, side: any) {
  const ticks = /`+/g;
  let match: RegExpMatchArray | null;
  let len = 0;

  if (node.isText) {
    while ((match = ticks.exec(node.text))) {
      len = Math.max(len, match[0].length);
    }
  }

  let result = len > 0 && side > 0 ? ' `' : '`';
  for (let i = 0; i < len; i++) {
    result += '`';
  }
  if (len > 0 && side < 0) {
    result += ' ';
  }
  return result;
}

export function isPlainURL(link, parent, index, side) {
  if (link.attrs.title || !/^\w+:/.test(link.attrs.href)) {
    return false;
  }

  const content = parent.child(index + (side < 0 ? -1 : 0));
  if (
    !content.isText ||
    content.text !== link.attrs.href ||
    content.marks[content.marks.length - 1] !== link
  ) {
    return false;
  }

  if (index === (side < 0 ? 1 : parent.childCount - 1)) {
    return true;
  }

  const next = parent.child(index + (side < 0 ? -2 : 1));
  return !link.isInSet(next.marks);
}
