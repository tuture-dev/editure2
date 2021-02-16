import React from 'react';
import { Button } from 'antd';
import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import { toggleMark } from 'prosemirror-commands';
import { undo, redo } from 'prosemirror-history';

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
      <Button
        onClick={() => {
          undo(props.view?.state, props.view?.dispatch);
          props.view.focus();
        }}>
        Undo
      </Button>
      <Button
        onClick={() => {
          redo(props.view?.state, props.view?.dispatch);
          props.view.focus();
        }}>
        Redo
      </Button>
      <Button
        style={{
          fontWeight:
            props.view &&
            isMarkActive(props.view?.state, props.schema?.marks.strong)
              ? 'bold'
              : undefined,
        }}
        onClick={() => {
          toggleMark(props.schema.marks.strong)(
            props.view?.state,
            props.view?.dispatch,
          );

          props.view.focus();
        }}>
        B
      </Button>
      <Button
        style={{
          fontWeight:
            props.view &&
            isMarkActive(props.view?.state, props.schema?.marks.em)
              ? 'bold'
              : undefined,
        }}
        onClick={() => {
          toggleMark(props.schema.marks.em)(
            props.view?.state,
            props.view?.dispatch,
          );

          props.view.focus();
        }}>
        I
      </Button>
      <Button
        style={{
          fontWeight:
            props.view &&
            isMarkActive(props.view?.state, props.schema?.marks.underline)
              ? 'bold'
              : undefined,
        }}
        onClick={() => {
          toggleMark(props.schema.marks.underline)(
            props.view?.state,
            props.view?.dispatch,
          );

          props.view.focus();
        }}>
        U
      </Button>
      <Button
        style={{
          fontWeight:
            props.view &&
            isMarkActive(props.view?.state, props.schema?.marks.strikethrough)
              ? 'bold'
              : undefined,
        }}
        onClick={() => {
          toggleMark(props.schema.marks.strikethrough)(
            props.view?.state,
            props.view?.dispatch,
          );

          props.view.focus();
        }}>
        S̶
      </Button>
      <Button
        style={{
          fontWeight:
            props.view &&
            isMarkActive(props.view?.state, props.schema?.marks.code)
              ? 'bold'
              : undefined,
        }}
        onClick={() => {
          toggleMark(props.schema.marks.code)(
            props.view?.state,
            props.view?.dispatch,
          );

          props.view.focus();
        }}>
        Code
      </Button>
      <Button
        style={{
          fontWeight:
            props.view &&
            isMarkActive(props.view?.state, props.schema?.marks.link)
              ? 'bold'
              : undefined,
        }}
        onClick={() =>
          toggleMark(props.schema.marks.link)(
            props.view?.state,
            props.view?.dispatch,
          )
        }>
        Link
      </Button>
      <br />
      <br />
    </div>
  );
}

export default Menu;
