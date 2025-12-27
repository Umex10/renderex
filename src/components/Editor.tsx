"use client";

import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { useTheme } from 'next-themes';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const Editor = ({ value, onChange }: EditorProps) => {

  const { resolvedTheme } = useTheme();
  return (
    <CodeMirror
      value={value}
      height="650px"
      // Hier aktivieren wir Markdown-Support inkl. Syntax Highlighting für Code-Blocks im Markdown
      extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
      onChange={(val) => onChange(val)}
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      className="border rounded-md overflow-hidden"
      basicSetup={{
        lineNumbers: true,
        highlightActiveLine: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: true,
        foldGutter: true,
      }}
    />
  );
};

export default Editor;