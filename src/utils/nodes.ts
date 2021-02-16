import { setBlockType, wrapIn, lift } from 'prosemirror-commands';
import { findParentNode, findSelectedNodeOfType } from 'prosemirror-utils';

export const isNodeActive = (type, attrs: Record<string, any> = {}) => (
  state,
) => {
  const node =
    findSelectedNodeOfType(type)(state.selection) ||
    findParentNode((node) => node.type === type)(state.selection);

  if (!Object.keys(attrs).length || !node) {
    return !!node;
  }

  return node.node.hasMarkup(type, { ...node.node.attrs, ...attrs });
};

export function toggleBlockType(type, toggleType, attrs = {}) {
  return (state, dispatch) => {
    const isActive = isNodeActive(type, attrs)(state);

    if (isActive) {
      return setBlockType(toggleType)(state, dispatch);
    }

    return setBlockType(type, attrs)(state, dispatch);
  };
}

export function toggleWrap(type, attrs?: Record<string, any>) {
  return (state, dispatch) => {
    const isActive = isNodeActive(type)(state);

    if (isActive) {
      return lift(state, dispatch);
    }

    return wrapIn(type, attrs)(state, dispatch);
  };
}
