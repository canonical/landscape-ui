import { FC } from "react";
import classNames from "classnames";
import { Editor } from "@monaco-editor/react";
import LoadingState from "../layout/LoadingState";
import classes from "./CodeEditor.module.scss";

interface CodeEditorProps {
  label: string;
  onChange: (value: string | undefined) => void;
  value: string | undefined;
  className?: string;
  error?: string | false;
  labelClassName?: string;
  required?: boolean;
}

const CodeEditor: FC<CodeEditorProps> = ({
  label,
  onChange,
  value,
  className,
  error = false,
  labelClassName,
  required = false,
}) => {
  return (
    <div
      className={classNames("p-form__group p-form-validation", {
        "is-error": error,
      })}
    >
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
      <div className="p-form__control u-clearfix">
        <Editor
          language="shell"
          height="16rem"
          loading={<LoadingState />}
          defaultValue="#!/bin/bash"
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
