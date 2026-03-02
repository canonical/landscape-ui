import React from "react";

interface EditorProps {
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onChange?: (value: string) => void;
}

export const Editor = ({ value, onChange, defaultValue }: EditorProps) => (
  <textarea
    data-testid="mock-monaco"
    value={value ?? defaultValue}
    onChange={(e) => onChange?.(e.target.value)}
  />
);

interface CodeEditorMockProps {
  readonly label: string;
  readonly value?: string;
  readonly error?: string | false;
  readonly headerContent?: React.ReactNode;
  readonly onChange?: (value: string) => void;
}

const CodeEditorMock = (props: CodeEditorMockProps) => {
  return (
    <div>
      <label>{props.label}</label>
      {props.headerContent}
      <Editor {...props} />
      {props.error && <span>{props.error}</span>}
    </div>
  );
};

export default CodeEditorMock;
