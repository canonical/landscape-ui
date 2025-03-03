import { Tabs } from "@canonical/react-components";
import type { FC } from "react";
import { useState } from "react";
import type { TabId } from "../../types";
import type { AutoinstallFileWithGroups } from "../../types/AutoinstallFile";
import AutoinstallFileInfo from "../AutoinstallFileInfo";
import AutoinstallFileVersionHistory from "../AutoinstallFileVersionHistory";
import { TABS } from "./constants";

interface ViewAutoinstallFileDetailsTabsProps {
  readonly file: AutoinstallFileWithGroups;
  readonly openDetailsPanel: (defaultTabId: TabId) => void;
  readonly defaultTabId?: TabId;
}

const ViewAutoinstallFileDetailsTabs: FC<
  ViewAutoinstallFileDetailsTabsProps
> = ({ file, defaultTabId = "info", openDetailsPanel }) => {
  const [tabId, setTabId] = useState<TabId>(defaultTabId);

  return (
    <>
      <Tabs
        listClassName="u-no-margin--bottom"
        links={TABS.map(({ label, id }) => ({
          label,
          active: id === tabId,
          role: "tab",
          onClick: (): void => {
            setTabId(id);
          },
        }))}
      />

      {tabId === "info" && <AutoinstallFileInfo file={file} />}

      {tabId === "version-history" && (
        <AutoinstallFileVersionHistory
          file={file}
          goBack={() => {
            openDetailsPanel("version-history");
          }}
        />
      )}
    </>
  );
};

export default ViewAutoinstallFileDetailsTabs;
