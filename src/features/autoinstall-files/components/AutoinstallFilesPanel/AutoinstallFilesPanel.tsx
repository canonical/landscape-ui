import { FC } from "react";
import AutoinstallFilesHeader from "../AutoinstallFilesHeader";
import AutoinstallFilesList from "../AutoinstallFilesList";
import { autoinstallFiles } from "@/tests/mocks/autoinstallFiles";

const AutoinstallFilesPanel: FC = () => {
  return (
    <>
      <AutoinstallFilesHeader />
      <AutoinstallFilesList autoinstallFiles={autoinstallFiles} />
    </>
  );
};

export default AutoinstallFilesPanel;
