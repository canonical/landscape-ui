import { CodeSnippet } from "@canonical/react-components";
import type { FC } from "react";

interface ScriptCodeProps {
  readonly code: string;
}

const ScriptCode: FC<ScriptCodeProps> = ({ code }) => {
  return (
    <CodeSnippet
      blocks={[
        {
          title: "Code preview",
          code: code,
          wrapLines: true,
          appearance: "numbered",
        },
      ]}
    />
  );
};

export default ScriptCode;
