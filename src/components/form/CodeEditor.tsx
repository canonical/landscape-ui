import type { FC, ReactNode } from "react";
import classNames from "classnames";
import { Editor } from "@monaco-editor/react";
import LoadingState from "../layout/LoadingState";
import classes from "./CodeEditor.module.scss";

interface CodeEditorProps {
  readonly label: string;
  readonly onChange: (value: string | undefined) => void;
  readonly value: string | undefined;
  readonly className?: string;
  readonly error?: string | false;
  readonly labelClassName?: string;
  readonly required?: boolean;
  readonly language?: string;
  readonly defaultValue?: string;
  readonly headerContent?: ReactNode;
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
}) => {
  return (
    <div
      className={classNames("p-form__group p-form-validation", {
        "is-error": error,
      })}
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

      <div className="p-form__control u-clearfix">
        <Editor
          language={language}
          height="16rem"
          loading={<LoadingState />}
          defaultValue={defaultValue}
          className={classNames(
            classes.highlighter,
            {
              [classes.error]: error,
            },
            className,
          )}
          value={value}
          onChange={onChange}
          options={{
            minimap: { enabled: false },
            renderLineHighlight: "none",
            padding: { top: 8, bottom: 8 },
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
