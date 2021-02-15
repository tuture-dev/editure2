import React, { useState } from 'react';

import { useRemirror, useExtension } from 'remirror/react';

/** @jsx jsx */
import { css, jsx } from '@emotion/react';

export const Menu = () => {
  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const { commands, active } = useRemirror({ autoUpdate: true });
  const remirrorRes = useRemirror({ autoUpdate: true });

  console.log('remirrorRes', remirrorRes);

  const handleClickLink = () => {
    if (active.link()) {
      commands.removeLink();
      return;
    }

    const url = window.prompt('输入链接：');

    if (!url) return;
    commands.updateLink({ href: url });
  };

  return (
    <div
      css={css`
        margin: auto;
        width: 666px;
      `}>
      <div
        css={css`
          button {
            margin-right: 8px;
            margin-top: 8px;
          }
        `}>
        <button onClick={() => commands.undo()}>撤销</button>
        <button onClick={() => commands.redo()}>重做</button>
        <button
          onClick={() => commands.toggleBold()}
          style={{
            fontWeight: active.bold() ? 'bold' : undefined,
          }}>
          B
        </button>
        <button
          onClick={() => commands.toggleItalic()}
          style={{ fontWeight: active.italic() ? 'bold' : undefined }}>
          I
        </button>
        <button
          onClick={() => commands.toggleUnderline()}
          style={{ fontWeight: active.underline() ? 'bold' : undefined }}>
          U
        </button>
        <button
          onClick={() => commands.toggleStrike()}
          style={{ fontWeight: active.strike() ? 'bold' : undefined }}>
          删除
        </button>
        <button
          onClick={() => commands.toggleCode()}
          style={{ fontWeight: active.code() ? 'bold' : undefined }}>
          行内代码
        </button>
        <button
          onClick={handleClickLink}
          style={{ fontWeight: active.link() ? 'bold' : undefined }}>
          链接
        </button>
        <button
          onClick={() => commands.toggleHeading({ level: 1 })}
          style={{ fontWeight: active.heading() ? 'bold' : undefined }}>
          一级标题
        </button>
        <button
          onClick={() => commands.toggleHeading({ level: 2 })}
          style={{
            fontWeight: active.heading({ level: 2 }) ? 'bold' : undefined,
          }}>
          二级标题
        </button>
        <button
          onClick={() => commands.toggleBlockquote()}
          style={{
            fontWeight: active.blockquote() ? 'bold' : undefined,
          }}>
          引用
        </button>
        <button
          onClick={() => commands.toggleCodeBlock({ language: 'jsx' })}
          style={{
            fontWeight: active.codeBlock() ? 'bold' : undefined,
          }}>
          代码块
        </button>
        <button
          onClick={() => commands.toggleBulletList()}
          style={{ fontWeight: active.bulletList() ? 'bold' : undefined }}>
          UL
        </button>
        <button
          onClick={() => commands.toggleOrderedList()}
          style={{ fontWeight: active.orderedList() ? 'bold' : undefined }}>
          OL
        </button>
        <button
          onClick={() => commands.insertHorizontalRule()}
          style={{
            fontWeight: active.horizontalRule() ? 'bold' : undefined,
          }}>
          分割线
        </button>
      </div>
    </div>
  );
};

export const TextEditor = () => {
  const { getRootProps } = useRemirror();

  return (
    <div
      css={css`
        width: 666px;
        margin: auto;

        .remirror-editor {
          border: 1px solid black;
          padding: 8px;
          min-height: 400px;
        }
      `}
      {...getRootProps()}></div>
  );
};
