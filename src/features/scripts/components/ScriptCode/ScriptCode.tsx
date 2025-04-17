import { CodeSnippet } from "@canonical/react-components";
import type { FC } from "react";
import { useScripts } from "../../hooks";
import LoadingState from "@/components/layout/LoadingState";

interface ScriptCodeProps {
  readonly scriptId: number;
}

const ScriptCode: FC<ScriptCodeProps> = ({ scriptId }) => {
  const { getScriptCodeQuery } = useScripts();

  const { data: scriptCodeData, isPending } = getScriptCodeQuery({
    script_id: scriptId,
  });

  return isPending ? (
    <LoadingState />
  ) : (
    <CodeSnippet
      blocks={[
        {
          title: "Code preview",
          code: scriptCodeData?.data,
          wrapLines: true,
          appearance: "numbered",
        },
      ]}
    />
  );
};

export default ScriptCode;
