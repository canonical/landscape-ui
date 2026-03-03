import React from "react";

interface EditorProps {
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onChange?: (value: string) => void;
  readonly language?: string;
  readonly theme?: string;
  readonly options?: Record<string, unknown>;
  readonly beforeMount?: unknown;
  readonly onMount?: unknown;
  readonly loading?: React.ReactNode;
  readonly className?: string;
}

export const Editor = ({
  value,
  onChange,
  defaultValue,
  language: _language,
  theme: _theme,
  options: _options,
  beforeMount: _beforeMount,
  onMount: _onMount,
  loading: _loading,
  className,
}: EditorProps) => (
  <textarea
    data-testid="mock-monaco"
    className={className}
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
      <Editor value={props.value} onChange={props.onChange} />
      {props.error && <span>{props.error}</span>}
    </div>
  );
};

export default CodeEditorMock;
