import { Editor, type Monaco } from "@monaco-editor/react";
import classNames from "classnames";
import type { ComponentProps, FC, ReactNode } from "react";
import { useCallback } from "react";
import { useTheme } from "@/context/theme";
import LoadingState from "../layout/LoadingState";
import classes from "./CodeEditor.module.scss";

interface CodeEditorProps {
  readonly label: string;
  readonly value: string | undefined;
  readonly className?: string;
  readonly error?: string | false;
  readonly labelClassName?: string;
  readonly onChange?: (value: string | undefined) => void;
  readonly onBlur?: () => void;
  readonly required?: boolean;
  readonly language?: string;
  readonly defaultValue?: string;
  readonly headerContent?: ReactNode;
  readonly options?: ComponentProps<typeof Editor>["options"];
  readonly monacoBeforeMount?: (monaco: Monaco) => void;
  readonly onMount?: ComponentProps<typeof Editor>["onMount"];
}

const CodeEditor: FC<CodeEditorProps> = ({
  label,
  onChange,
  value,
  className,
  error = false,
  labelClassName,
  required = false,
  language = "shell",
  defaultValue,
  headerContent,
  options,
  monacoBeforeMount,
  onMount,
  onBlur,
}) => {
  const { isDarkMode } = useTheme();

  const handleBeforeMount = useCallback(
    (monaco: Monaco) => {
      if (monacoBeforeMount) {
        monacoBeforeMount(monaco);
      }
    },
    [monacoBeforeMount],
  );

  return (
    <div
      className={classNames(
        "p-form__group p-form-validation",
        { "is-error": error },
        classes.container,
      )}
    >
      <div className={classes.header}>
        <label
          className={classNames(
            "p-form__label",
            { "is-required": required },
            labelClassName,
          )}
          htmlFor="code"
        >
          {label}
        </label>

        {headerContent}
      </div>

      <div
        className={classNames("p-form__control u-clearfix", classes.container)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            onBlur?.();
          }
        }}
      >
        <Editor
          language={language}
          loading={<LoadingState />}
          defaultValue={defaultValue}
          theme={isDarkMode ? "vs-dark" : "vs-light"}
          className={classNames(
            classes.highlighter,
            { [classes.error]: error },
            className,
          )}
          value={value}
          onChange={onChange}
          beforeMount={handleBeforeMount}
          onMount={onMount}
          options={{
            minimap: { enabled: false },
            renderLineHighlight: "none",
            padding: { top: 8, bottom: 8 },
            ...options,
          }}
        />

        {error && (
          <p className="p-form-validation__message" id="code-error-message">
            <strong>Error: </strong>
            <span>{error}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
