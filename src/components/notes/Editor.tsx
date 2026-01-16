"use client";

import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { useTheme } from 'next-themes';
import { EditorView } from "@codemirror/view";
import { useIsMobile } from '@/hooks/shared/use-mobile';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
    heightForMobile: string
  heightForDesktop: string,

}

const Editor = ({ value, onChange, heightForMobile, heightForDesktop  }: EditorProps) => {

  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <CodeMirror
      value={value}
      height={isMobile ? heightForMobile : heightForDesktop}
      extensions={[
        markdown({ base: markdownLanguage, codeLanguages: languages }),
        EditorView.lineWrapping
      ]}
      width="100%"
      onChange={(val) => onChange(val)}
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      className="border border-main rounded-md overflow-hidden"
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