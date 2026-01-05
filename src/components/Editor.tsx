"use client";

import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { useTheme } from 'next-themes';
import { EditorView } from "@codemirror/view";
import { useIsMobile } from '@/hooks/use-mobile';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const Editor = ({ value, onChange }: EditorProps) => {

  const { resolvedTheme } = useTheme();

  const isMobile = useIsMobile();
  return (
    <CodeMirror
      value={value}
      height={isMobile ? "500px" : "650px"}
      extensions={[
        markdown({ base: markdownLanguage, codeLanguages: languages }),
        EditorView.lineWrapping
      ]}
      width="100%"
      onChange={(val) => onChange(val)}
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      className="border-1 border-violet-400 rounded-md overflow-hidden"
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