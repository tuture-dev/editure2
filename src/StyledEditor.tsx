/* @jsx jsx */
import { jsx } from '@emotion/react';
import styled from '@emotion/styled';

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

  :not(pre) > code {
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

export default StyledEditor;
