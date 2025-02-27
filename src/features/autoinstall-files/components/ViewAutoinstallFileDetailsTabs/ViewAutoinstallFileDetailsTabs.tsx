import InfoItem from "@/components/layout/InfoItem";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { Tabs } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { useState } from "react";
import type { TabId } from "../../types";
import type { AutoinstallFileWithGroups } from "../../types/AutoinstallFile";
import AutoinstallFileEmployeeGroupsList from "../AutoinstallFileEmployeeGroupsList";
import AutoinstallFileVersionHistory from "../AutoinstallFileVersionHistory";
import classes from "./ViewAutoinstallFileDetailsTabs.module.scss";
import { TABS } from "./constants";

interface ViewAutoinstallFileDetailsTabsProps {
  readonly defaultTabId?: TabId;
  readonly file: AutoinstallFileWithGroups;
  readonly openDetailsPanel: (defaultTabId: TabId) => void;
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

      {tabId === "info" && (
        <div className={classes.info}>
          <div className={classes.row}>
            <InfoItem label="Name" value={file.filename} />
            <InfoItem label="Version" value={file.version} />
          </div>

          <div className={classes.row}>
            <InfoItem
              label="Last modified"
              value={`${moment(file.last_modified_at).format(
                DISPLAY_DATE_TIME_FORMAT,
              )}, by Stephanie Domas`}
            />
            <InfoItem
              label="Date created"
              value={moment(file.created_at).format(DISPLAY_DATE_TIME_FORMAT)}
            />
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

      {tabId === "version-history" && (
        <AutoinstallFileVersionHistory
          file={file}
          openDetailsPanel={openDetailsPanel}
        />
      )}
    </>
  );
};

export default ViewAutoinstallFileDetailsTabs;
