import React, { useCallback, useMemo, useState } from 'react';
import { ProsemirrorDevTools } from '@remirror/dev';

import { BoldExtension } from 'remirror/extension/bold';
import { ItalicExtension } from 'remirror/extension/italic';
import { UnderlineExtension } from 'remirror/extension/underline';
import { BlockquoteExtension } from 'remirror/extension/blockquote';
import { StrikeExtension } from 'remirror/extension/strike';
import { HistoryExtension } from 'remirror/extension/history';
import { CodeExtension } from 'remirror/extension/code';

import refractorJsx from 'refractor/lang/jsx';
import { CodeBlockExtension } from 'remirror/extension/code-block';

import { LinkExtension } from 'remirror/extension/link';
import { HeadingExtension } from 'remirror/extension/heading';
import {
  BulletListExtension,
  OrderedListExtension,
} from 'remirror/preset/list';
import { ImageExtension } from 'remirror/extension/image';
import { HorizontalRuleExtension } from 'remirror/extension/horizontal-rule';
import { CorePreset } from 'remirror/preset/core';
import { RemirrorProvider, useManager } from 'remirror/react';

/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { Menu, TextEditor } from './MyEditor';
import './App.css';

const EditorWrapper = () => {
  const manager = useManager([
    new HistoryExtension({}),
    new CorePreset({}),
    new BoldExtension({}),
    new ItalicExtension(),
    new UnderlineExtension(),
    new StrikeExtension(),
    new CodeExtension(),
    new LinkExtension({
      autoLink: true,
    }),
    new HeadingExtension({
      levels: [1, 2],
    }),
    new BlockquoteExtension(),
    new CodeBlockExtension({
      supportedLanguages: [refractorJsx],
    }),
    new ImageExtension(),
    new HorizontalRuleExtension(),
  ]);

  return (
    <RemirrorProvider manager={manager}>
      <div
        css={css`
          width: 666px;
          margin: auto;
          padding-top: 40px;
        `}>
        <Menu />
        <TextEditor />
      </div>
      <ProsemirrorDevTools />
    </RemirrorProvider>
  );
};

export default EditorWrapper;
