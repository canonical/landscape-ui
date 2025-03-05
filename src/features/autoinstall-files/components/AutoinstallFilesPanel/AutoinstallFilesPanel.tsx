import LoadingState from "@/components/layout/LoadingState";
import { type FC } from "react";
import { useGetAutoinstallFiles } from "../../api";
import AutoinstallFilesHeader from "../AutoinstallFilesHeader";
import AutoinstallFilesList from "../AutoinstallFilesList";

const AutoinstallFilesPanel: FC = () => {
  const { autoinstallFiles, isAutoinstallFilesLoading } =
    useGetAutoinstallFiles({
      with_groups: true,
    });

  return (
    <>
      <AutoinstallFilesHeader />

      {isAutoinstallFilesLoading ? (
        <LoadingState />
      ) : (
        <AutoinstallFilesList autoinstallFiles={autoinstallFiles} />
      )}
    </>
  );
};

export default AutoinstallFilesPanel;
