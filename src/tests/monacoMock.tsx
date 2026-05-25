import React from "react";
import { useEffect } from "react";

interface EditorProps {
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onChange?: (value: string) => void;
  readonly language?: string;
  readonly theme?: string;
  readonly options?: Record<string, unknown>;
  readonly beforeMount?: (monaco: unknown) => void;
  readonly onMount?: unknown;
  readonly loading?: React.ReactNode;
  readonly className?: string;
}

interface MonacoTextareaProps {
  readonly beforeMount?: (monaco: unknown) => void;
  readonly className?: string;
  readonly defaultValue?: string;
  readonly language?: string;
  readonly onChange?: (value: string) => void;
  readonly theme?: string;
  readonly value?: string;
}

function MonacoTextarea({
  beforeMount,
  className,
  defaultValue,
  language,
  onChange,
  theme,
  value,
}: MonacoTextareaProps) {
  useEffect(() => {
    beforeMount?.({ mocked: true });
  }, [beforeMount]);

  return (
    <textarea
      data-testid="mock-monaco"
      data-language={language}
      data-theme={theme}
      className={className}
      value={value ?? defaultValue}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}

export const Editor = ({
  value,
  onChange,
  defaultValue,
  language,
  theme,
  options: _options,
  beforeMount,
  onMount: _onMount,
  loading: _loading,
  className,
}: EditorProps) => {
  return (
    <MonacoTextarea
      beforeMount={beforeMount}
      className={className}
      defaultValue={defaultValue}
      language={language}
      onChange={onChange}
      theme={theme}
      value={value}
    />
  );
};

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
