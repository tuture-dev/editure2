import React from 'react';
import { Button, Select } from 'antd';
import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import { toggleMark, setBlockType } from 'prosemirror-commands';
import { undo, redo } from 'prosemirror-history';

/* @jsx jsx */
import { jsx, css } from '@emotion/react';
import styled from '@emotion/styled';

import { isMarkActive } from './utils/marks';
import {
  isNodeActive,
  toggleBlockType,
  toggleWrap,
  toggleList,
} from './utils/nodes';

const { Option } = Select;

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
      <Select
        style={{
          marginRight: '10px',
        }}
        defaultValue="正文"
        onChange={(value) => {
          // TODO: 根据选中块高亮对应的 select value
          if (/h[1-6]/.test(value)) {
            toggleBlockType(
              props.schema.nodes.heading,
              props.schema.nodes.paragraph,
              { level: value.slice(1) },
            )(props.view.state, props.view.dispatch);
          } else {
            setBlockType(props.schema.nodes.paragraph)(
              props.view.state,
              props.view.dispatch,
            );
          }

          props.view.focus();
        }}>
        <Option value="paragraph">正文</Option>
        <Option value="h1">标题 1</Option>
        <Option value="h2">标题 2</Option>
        <Option value="h3">标题 3</Option>
        <Option value="h4">标题 4</Option>
        <Option value="h5">标题 5</Option>
      </Select>
      <Button
        style={{
          fontWeight:
            props.view &&
            isNodeActive(props.schema?.nodes.blockquote)(props.view?.state)
              ? 'bold'
              : undefined,
        }}
        onClick={() => {
          toggleWrap(props.schema.nodes.blockquote)(
            props.view?.state,
            props.view?.dispatch,
          );

          props.view.focus();
        }}>
        引用
      </Button>
      <Button
        style={{
          fontWeight:
            props.view &&
            isNodeActive(props.schema?.nodes.bullet_list)(props.view?.state)
              ? 'bold'
              : undefined,
        }}
        onClick={() => {
          toggleList(
            props.schema.nodes.bullet_list,
            props.schema.nodes.list_item,
          )(props.view?.state, props.view?.dispatch);

          props.view.focus();
        }}>
        无序列表
      </Button>
      <br />
      <br />
    </div>
  );
}

export default Menu;
