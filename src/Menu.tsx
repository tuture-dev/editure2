import React from 'react';
import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import { toggleMark } from 'prosemirror-commands';

/* @jsx jsx */
import { jsx, css } from '@emotion/react';
import styled from '@emotion/styled';

import { isMarkActive, backticksFor } from './utils/marks';

type Props = {
  view?: EditorView;
  schema?: Schema;
};

function Menu(props: Props) {
  return (
    <div
      css={css`
        button {
          margin-right: 10px;
        }
      `}>
      <button
        type="button"
        style={{
          fontWeight:
            props.view &&
            isMarkActive(props.view?.state, props.schema?.marks.code)
              ? 'bold'
              : undefined,
        }}
        onClick={() =>
          toggleMark(props.schema.marks.code)(
            props.view?.state,
            props.view?.dispatch,
          )
        }>
        Code
      </button>
      <br />
      <br />
    </div>
  );
}

export default Menu;
