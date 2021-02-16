import React from 'react';
import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { gapCursor } from 'prosemirror-gapcursor';
import { baseKeymap, Keymap } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import { MarkdownParser, MarkdownSerializer } from 'prosemirror-markdown';
import { inputRules, InputRule } from 'prosemirror-inputrules';
import { history } from 'prosemirror-history';

import './App.css';
import StyledEditor from './StyledEditor';
import Menu from './Menu';
import schema from './utils/schema';
import createParser from './utils/parser';
import createSerializer from './utils/serializer';
import createKeymaps from './utils/keymaps';
import createInputRules from './utils/inputRules';

type Props = {
  value?: string;
  defaultValue?: string;
  onChange?: any;
};

class Editor extends React.Component<Props> {
  view: EditorView;
  element?: HTMLElement | null;
  inputRules: InputRule[];
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
    this.inputRules = createInputRules();
    this.keymaps = createKeymaps();
    this.parser = createParser();
    this.serializer = createSerializer();
    this.view = this.createView();
  }

  createState(value?: string) {
    const doc = this.createDocument(value || this.props.defaultValue);

    return EditorState.create({
      schema,
      doc,
      plugins: [
        history(),
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

  value() {
    return this.serializer.serialize(this.view.state.doc);
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
        <Menu view={this.view} schema={schema} />
        <StyledEditor ref={(ref) => (this.element = ref)} />
      </React.Fragment>
    );
  }
}

export default Editor;
