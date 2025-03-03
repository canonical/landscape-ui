import InfoItem from "@/components/layout/InfoItem";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { Col, Row, Tabs } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { useState } from "react";
import type { TabId } from "../../types";
import type { AutoinstallFileWithGroups } from "../../types/AutoinstallFile";
import AutoinstallFileEmployeeGroupsList from "../AutoinstallFileEmployeeGroupsList";
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

      {tabId === "info" && (
        <>
          <Row className="u-no-padding">
            <Col size={6}>
              <InfoItem label="Name" value={file.filename} />
            </Col>

            <Col size={6}>
              <InfoItem label="Version" value={file.version} />
            </Col>
          </Row>

          <Row className="u-no-padding">
            <Col size={6}>
              <InfoItem
                label="Last modified"
                value={moment(file.last_modified_at).format(
                  DISPLAY_DATE_TIME_FORMAT,
                )}
              />
            </Col>

            <Col size={6}>
              <InfoItem
                label="Date created"
                value={moment(file.created_at).format(DISPLAY_DATE_TIME_FORMAT)}
              />
            </Col>
          </Row>

          <InfoItem
            label="Employee groups associated"
            value={
              <AutoinstallFileEmployeeGroupsList
                groupNames={file.groups.map((group) => group.name)}
              />
            }
          />
        </>
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
