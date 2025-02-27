import LoadingState from "@/components/layout/LoadingState";
import { type FC } from "react";
import { useAutoinstallFiles } from "../../api";
import AutoinstallFilesHeader from "../AutoinstallFilesHeader";
import AutoinstallFilesList from "../AutoinstallFilesList";

const AutoinstallFilesPanel: FC = () => {
  const files = useAutoinstallFiles({
    with_groups: true,
  });

  return (
    <>
      <AutoinstallFilesHeader />

      {!files ? (
        <LoadingState />
      ) : (
        <AutoinstallFilesList autoinstallFiles={files} />
      )}
    </>
  );
};

export default AutoinstallFilesPanel;
