import { CodeSnippet } from "@canonical/react-components";
import type { FC } from "react";
import CopyCodeButton from "../CopyCodeButton";
import classes from "./CopyableCodeSnippet.module.scss";

interface CopyableCodeSnippetProps {
  readonly value: string;
  readonly wrapLines?: boolean;
}

const CopyableCodeSnippet: FC<CopyableCodeSnippetProps> = ({
  value,
  wrapLines = false,
}) => {
  return (
    <div className={classes.codeBlock}>
      <CodeSnippet blocks={[{ code: value, wrapLines }]} />
      <CopyCodeButton className={classes.copyButton} value={value} />
    </div>
  );
};

export default CopyableCodeSnippet;
