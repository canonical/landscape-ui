import InfoItem from "@/components/layout/InfoItem";
import NoData from "@/components/layout/NoData";
import useRoles from "@/hooks/useRoles";
import { Col, Row } from "@canonical/react-components";
import type { FC } from "react";
import { Link } from "react-router";
import { formatTitleCase, getAuthorInfo } from "../../helpers";
import type { SingleScript } from "../../types";
import AttachmentFile from "../AttachmentFile";
import classes from "./ScriptDetailsInfo.module.scss";

interface ScriptDetailsInfoProps {
  readonly script: SingleScript;
}

const ScriptDetailsInfo: FC<ScriptDetailsInfoProps> = ({ script }) => {
  const { getAccessGroupQuery } = useRoles();

  const { data: getAccessGroupQueryResponse } = getAccessGroupQuery();

  const accessGroup =
    getAccessGroupQueryResponse?.data.find(
      (group) => group.name == script.access_group,
    )?.title || script.access_group;

  return (
    <>
      <Row className="u-no-padding">
        <Col size={6}>
          <InfoItem label="name" value={script.title} />
        </Col>

        <Col size={6}>
          <InfoItem label="version" value={script.version_number} />
        </Col>
      </Row>
      <Row className="u-no-padding">
        <Col size={6}>
          <InfoItem label="status" value={formatTitleCase(script.status)} />
        </Col>

        <Col size={6}>
          <InfoItem label="access group" value={accessGroup} />
        </Col>
      </Row>
      <Row className="u-no-padding">
        <InfoItem
          label="Date created"
          value={getAuthorInfo({
            author: script.created_by.name,
            date: script.created_at,
          })}
        />
      </Row>
      <Row className="u-no-padding">
        <InfoItem
          label="Last modified"
          value={getAuthorInfo({
            author: script.last_edited_by.name,
            date: script.last_edited_at,
          })}
        />
      </Row>

      <Row className="u-no-padding">
        <Col size={12}>
          <InfoItem
            className={classes.attachmentBlock}
            label="attachments"
            value={
              script.attachments.length > 0 ? (
                script.attachments.map((att) => (
                  <AttachmentFile
                    key={att.id}
                    attachmentId={att.id}
                    filename={att.filename}
                    scriptId={script.id}
                  />
                ))
              ) : (
                <NoData />
              )
            }
          />
        </Col>
      </Row>

      <InfoItem
        label="associated profiles"
        value={
          script.script_profiles.length > 0 ? (
            script.script_profiles.map((profile, index) => (
              <Link
                to="/scripts?tab=profiles"
                state={{ scriptProfileId: profile.id }}
                key={profile.id}
              >
                {profile.title}
                {index < script.script_profiles.length - 1 ? ", " : ""}{" "}
              </Link>
            ))
          ) : (
            <NoData />
          )
        }
      />
    </>
  );
};

export default ScriptDetailsInfo;
