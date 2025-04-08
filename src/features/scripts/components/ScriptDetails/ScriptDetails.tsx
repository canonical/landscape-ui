import type { FC } from "react";
import { useGetSingleScript } from "@/features/scripts";

interface ScriptDetailsProps {
  readonly scriptId: number;
}

const ScriptDetails: FC<ScriptDetailsProps> = ({ scriptId }) => {
  const { script } = useGetSingleScript(scriptId);

  console.log(script);

  return (
    <div>
      <p>Script ID: {scriptId}</p>
      {/* Add more details about the script here */}
    </div>
  );
};

export default ScriptDetails;
