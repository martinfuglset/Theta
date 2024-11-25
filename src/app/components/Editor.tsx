'use client';

import React from 'react';
import Editor from '@monaco-editor/react';

interface EditorProps {
  script: string;
  setScript: (value: string) => void;
}

const ScriptEditor: React.FC<EditorProps> = ({ script, setScript }) => {
  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      value={script}
      onChange={(value) => setScript(value || '')}
      theme="vs-dark"
      options={{ minimap: { enabled: false } }}
    />
  );
};

export default ScriptEditor;
