import InfoItem from "@/components/layout/InfoItem";
import { Tabs } from "@canonical/react-components";
import type { FC } from "react";
import { useState } from "react";
import type { AutoinstallFileWithGroups } from "../../types/AutoinstallFile";
import AutoinstallFileEmployeeGroupsList from "../AutoinstallFileEmployeeGroupsList";
import AutoinstallFileVersionHistory from "../AutoinstallFileVersionHistory";
import classes from "./ViewAutoinstallFileDetailsTabs.module.scss";

type TabId = "info" | "event-log" | "version-history";

const tabs: {
  label: string;
  id: TabId;
}[] = [
  {
    label: "Info",
    id: "info",
  },
  {
    label: "Event log",
    id: "event-log",
  },
  {
    label: "Version history",
    id: "version-history",
  },
];

const ViewAutoinstallFileDetailsTabs: FC<{
  readonly file: AutoinstallFileWithGroups;
}> = ({ file }) => {
  const [tabId, setTabId] = useState<TabId>("info");

  return (
    <>
      <Tabs
        listClassName="u-no-margin--bottom"
        links={tabs.map(({ label, id }) => ({
          label,
          active: id === tabId,
          role: "tab",
          onClick: (): void => {
            setTabId(id);
          },
        }))}
      />

      {tabId === "info" && (
        <div className={classes.info}>
          <div className={classes.row}>
            <InfoItem label="Name" value={file.filename} />
            <InfoItem label="Version" value={file.version} />
          </div>

          <div className={classes.row}>
            <InfoItem label="Last modified" value={file.last_modified_at} />
            <InfoItem label="Date created" value={file.created_at} />
          </div>

          <InfoItem
            label="Employee groups associated"
            value={
              <AutoinstallFileEmployeeGroupsList
                groupNames={file.groups.map((group) => group.name)}
              />
            }
          />
        </div>
      )}

      {/* {tabId === "event-log" && (
        <ViewAutoinstallFileDetailsEventLog events={file.events} />
      )} */}

      {tabId === "version-history" && (
        <AutoinstallFileVersionHistory file={file} />
      )}
    </>
  );
};

export default ViewAutoinstallFileDetailsTabs;
