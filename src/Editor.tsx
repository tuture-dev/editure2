import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from 'react';
// import { schema } from 'prosemirror-schema-basic';
import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { gapCursor } from 'prosemirror-gapcursor';
import { Schema, NodeSpec, MarkSpec, Mark } from 'prosemirror-model';
import { baseKeymap, toggleMark, Keymap } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import {
  defaultMarkdownParser,
  defaultMarkdownSerializer,
  MarkdownParser,
  MarkdownSerializer,
} from 'prosemirror-markdown';
import { inputRules, InputRule } from 'prosemirror-inputrules';
import markdownit from 'markdown-it';

import './App.css';

/* @jsx jsx */
import { jsx } from '@emotion/react';
import styled from '@emotion/styled';

import markInputRule from './utils/markInputRule';

type Props = {
  value?: string;
  defaultValue?: string;
  onChange?: any;
};

class Editor extends React.Component<Props> {
  view: EditorView;
  element?: HTMLElement | null;
  schema: Schema;
  inputRules: InputRule[];
  nodes: { [name: string]: NodeSpec };
  marks: { [name: string]: MarkSpec };
  parser: MarkdownParser;
  serializer: MarkdownSerializer;
  keymaps: Keymap<any>;

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.value && prevProps.value !== this.props.value) {
      const newState = this.createState(this.props.value);
      this.view.updateState(newState);
    }
  }

  init() {
    // this.extensions = this.createExtensions();
    this.nodes = this.createNodes();
    this.marks = this.createMarks();
    this.schema = this.createSchema();
    this.inputRules = this.createInputRules();
    this.keymaps = this.createKeymaps();
    this.parser = this.createParser();
    this.serializer = this.createSerializer();
    this.view = this.createView();
  }

  createKeymaps() {
    let keys: Keymap<any> = {},
      type;

    function bind(key: any, cmd: any) {
      keys[key] = cmd;
    }

    // code keymaps
    if ((type = this.schema.marks.code)) {
      bind('Mod-e', toggleMark(type));
    }

    return keys;
  }

  createSerializer() {
    const nodes = {
      blockquote: (state: any, node: any) => {
        state.wrapBlock('> ', null, node, () => state.renderContent(node));
      },
      text: (state: any, node: any) => {
        state.text(node.text);
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
      code: {
        open(_state: any, _mark: any, parent: any, index: any) {
          return backticksFor(parent.child(index), -1);
        },
        close(_state: any, _mark: any, parent: any, index: any) {
          return backticksFor(parent.child(index - 1), 1);
        },
        escape: false,
      },
    };

    return new MarkdownSerializer(nodes, marks);
  }

  createParser() {
    const tokens = {
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
      this.schema,
      markdownit('commonmark', { html: false }),
      tokens,
    );
  }

  createState(value?: string) {
    const doc = this.createDocument(value || this.props.defaultValue);

    return EditorState.create({
      schema: this.schema,
      doc,
      plugins: [
        gapCursor(),
        inputRules({
          rules: this.inputRules,
        }),
        keymap(this.keymaps),
        keymap(baseKeymap),
      ],
    });
  }

  createDocument(content?: string) {
    return this.parser.parse(content);
    // return defaultMarkdownParser.parse(content);
  }

  createView() {
    if (!this.element) {
      throw new Error('createView called before ref available');
    }

    const view = new EditorView(this.element, {
      state: this.createState(),
      dispatchTransaction: (transaction) => {
        const { state, transactions } = this.view.state.applyTransaction(
          transaction,
        );

        console.log('state', this.view.state);

        this.view.updateState(state);

        // If any of the transactions being dispatched resulted in the doc
        // changing then call our own change handler to let the outside world
        // know
        if (transactions.some((tr) => tr.docChanged)) {
          this.handleChange();
        }

        // Because Prosemirror and React are not linked we must tell React that
        // a render is needed whenever the Prosemirror state changes.
        this.forceUpdate();
      },
    });

    return view;
  }

  createExtensions() {}

  createNodes() {
    // nodes 就是 name => schema 的映射
    let nodes: { [name: string]: NodeSpec } = {
      // doc 和 text 是必须的
      doc: {
        content: 'block+',
      },
      paragraph: {
        content: 'inline*',
        group: 'block',
        parseDOM: [{ tag: 'p' }],
        toDOM() {
          return ['p', 0];
        },
      },
      blockquote: {
        content: 'block+',
        group: 'block',
        parseDOM: [{ tag: 'blockquote' }],
        toDOM: () => ['blockquote', 0],
      },
      text: {
        group: 'inline',
      },
      hard_break: {
        inline: true,
        group: 'inline',
        selectable: false,
        parseDOM: [{ tag: 'br' }],
        toDOM() {
          return ['br'];
        },
      },
    };

    return nodes;
  }

  createMarks() {
    // marks 就是 name => schema 的映射
    let marks: { [name: string]: MarkSpec } = {
      code: {
        parseDOM: [{ tag: 'code' }],
        // @ts-ignore
        toDOM: () => ['code'],
      },
    };

    return marks;
  }

  createSchema() {
    return new Schema({
      nodes: this.nodes,
      marks: this.marks,
    });
  }

  createInputRules() {
    let inputRules = [];

    // marks
    const code = markInputRule(
      /(?:^|[^`])(`([^`]+)`)$/,
      this.schema['marks']['code'],
    );
    inputRules.push(code);

    return inputRules;
  }

  value() {
    return this.serializer.serialize(this.view.state.doc);
    // return defaultMarkdownSerializer.serialize(this.view.state.doc);
  }

  handleChange() {
    if (!this.props.onChange) return;

    this.props.onChange(() => {
      return this.value();
    });
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <div>
            <button
              type="button"
              style={{
                fontWeight:
                  this.view &&
                  markActive(this.view?.state, this.schema?.marks.code)
                    ? 'bold'
                    : undefined,
              }}
              onClick={() =>
                toggleMark(this.schema.marks.code)(
                  this.view?.state,
                  this.view?.dispatch,
                )
              }>
              Code
            </button>
            <br />
            <br />
          </div>
        </div>
        <StyledEditor ref={(ref) => (this.element = ref)} />
      </React.Fragment>
    );
  }
}

function markActive(state: any, type: any) {
  let { from, $from, to, empty } = state.selection;
  if (empty) return type.isInSet(state.storedMarks || $from.marks());
  else return state.doc.rangeHasMark(from, to, type);
}

function backticksFor(node: any, side: any) {
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

const StyledEditor = styled.div`
  border: 2px solid #ddd;
  padding: 10px;
  outline: none;

  & > .ProseMirror {
    outline: none;
  }

  input {
    box-sizing: border-box;
    font-size: 0.85em;
    width: 100%;
    border: 2px solid #ddd;
    background: #fafafa;
  }

  input:focus {
    outline: 0;
    border-color: blue;
  }

  body {
    margin: 0;
    line-height: 24px;
  }

  h1 {
    font-size: 28px;
    line-height: 36px;
  }

  h2 {
    font-size: 24px;
    line-height: 32px;
  }

  h3 {
    font-size: 20px;
    line-height: 28px;
  }

  h4 {
    font-size: 16px;
    line-height: 24px;
  }

  p {
    line-height: 24px;
    margin: 0;
  }

  pre {
    color: white;
    background-color: rgb(30, 30, 30);
    white-space: pre-wrap;
    margin: 0 !important;
  }

  code {
    font-family: monospace;
    background-color: #eee;
    padding: 3px;
  }

  img {
    max-width: 100%;
    max-height: 20em;
    margin: 1em 0;
  }

  blockquote {
    border-left: 2px solid #ddd;
    margin: 0.5em 0;
    padding-left: 10px;
    color: #aaa;
  }

  blockquote[dir='rtl'] {
    border-left: none;
    margin: 0.5em 0;
    padding-left: 0;
    padding-right: 10px;
    border-right: 2px solid #ddd;
  }

  table {
    border-collapse: collapse;
  }

  td {
    padding: 10px;
    border: 2px solid #ddd;
  }

  a {
    cursor: pointer;
    word-wrap: break-word;
    text-decoration: none;
    color: #096dd9;
  }

  [data-slate-node='element']:not(li) {
    margin-top: 1em;
  }
`;

export default Editor;
