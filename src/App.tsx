import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import debounce from 'lodash/debounce';

import Editor from './Editor';
/** @jsx jsx */
import { css, jsx } from '@emotion/react';

const savedText = localStorage.getItem('saved');
const exampleText = `
This is example content. It is persisted between reloads in localStorage.
`;
const defaultValue = savedText || exampleText;

function App() {
  const [value, setValue] = useState(undefined);

  const handleChange = debounce((value) => {
    const text = value();
    console.log(text);
    localStorage.setItem('saved', text);
  }, 250);

  const handleUpdateValue = () => {
    const existing = localStorage.getItem('saved') || '';
    const value = `${existing}\n\nedit!`;
    localStorage.setItem('saved', value);

    setValue(value);
  };

  return (
    <div
      css={css`
        width: 666px;
        margin: auto;
        padding-top: 40px;
      `}>
      <Editor
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
      />
    </div>
  );
}

export default App;
