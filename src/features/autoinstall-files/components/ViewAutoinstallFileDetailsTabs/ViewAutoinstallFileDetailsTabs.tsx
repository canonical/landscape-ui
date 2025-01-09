import { FC, useState } from "react";
import { AutoinstallFile } from "../../types";
import classes from "./ViewAutoinstallFileDetailsTabs.module.scss";
import InfoItem from "@/components/layout/InfoItem";
import { Tabs } from "@canonical/react-components";
import ViewAutoinstallFileDetailsEventLog from "../ViewAutoinstallFileDetailsEventLog";
import { createEmployeeGroupString } from "../../helpers";

type TabId = "info" | "event-log";

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
];

const ViewAutoinstallFileDetailsTabs: FC<{ file: AutoinstallFile }> = ({
  file,
}) => {
  const [tabId, setTabId] = useState<TabId>("info");

  return (
    <>
      <Tabs
        listClassName="u-no-margin--bottom"
        links={tabs.map(({ label, id }) => ({
          label,
          active: id === tabId,
          role: "tab",
          onClick: () => {
            setTabId(id);
          },
        }))}
      />

      {tabId === "info" && (
        <div className={classes.info}>
          <div className={classes.row}>
            <InfoItem label="Name" value={file.name} />
            <InfoItem label="Version" value={file.version} />
          </div>

          <div className={classes.row}>
            <InfoItem label="Last modified" value={file.lastModified} />
            <InfoItem label="Date created" value={file.dateCreated} />
          </div>

          <InfoItem
            label="Employee groups associated"
            value={createEmployeeGroupString(file.employeeGroupsAssociated)}
          />
        </div>
      )}

      {tabId === "event-log" && (
        <ViewAutoinstallFileDetailsEventLog events={file.events} />
      )}
    </>
  );
};

export default ViewAutoinstallFileDetailsTabs;
