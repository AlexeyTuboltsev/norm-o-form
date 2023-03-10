import CodeEditor from '@uiw/react-textarea-code-editor';
import React from 'react';

export const CodeTab:React.FunctionComponent<{code:string}> = ({code}) => {
  return (
    <CodeEditor
      value={code}
      language="js"
      placeholder="Please enter JS code."
      padding={15}
      style={{
        fontSize: 12,
        backgroundColor: "#f5f5f5",
        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
      }}
    />
  );
}
