import { Tabs } from "@canonical/react-components";
import type { FC } from "react";
import { useState } from "react";
import type { TabId } from "../../types";
import type { AutoinstallFile, WithGroups } from "../../types/AutoinstallFile";
import AutoinstallFileInfo from "../AutoinstallFileInfo";
import AutoinstallFileVersionHistory from "../AutoinstallFileVersionHistory";
import { TABS } from "./constants";

interface AutoinstallFileTabsProps {
  readonly file: WithGroups<AutoinstallFile>;
  readonly openVersionHistory: (file: WithGroups<AutoinstallFile>) => void;
  readonly defaultTabId?: TabId;
}

const AutoinstallFileTabs: FC<AutoinstallFileTabsProps> = ({
  file,
  openVersionHistory,
  defaultTabId = "info",
}) => {
  const [tabId, setTabId] = useState(defaultTabId);

  const links = TABS.map(({ label, id }) => ({
    label,
    active: id === tabId,
    role: "tab",
    onClick: (): void => {
      setTabId(id);
    },
  }));

  const goBack = (): void => {
    openVersionHistory(file);
  };

  return (
    <>
      <Tabs links={links} />

      {tabId === "info" && <AutoinstallFileInfo file={file} />}

      {tabId === "version-history" && (
        <AutoinstallFileVersionHistory file={file} goBack={goBack} />
      )}
    </>
  );
};

export default AutoinstallFileTabs;
