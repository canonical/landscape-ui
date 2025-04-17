/* eslint-disable @typescript-eslint/no-unused-vars */
import InfoItem from "@/components/layout/InfoItem";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { Col, Row } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import type { SingleScript } from "../../types";
import { Link } from "react-router";

interface ScriptDetailsInfoProps {
  readonly script: SingleScript;
  readonly scriptAttachments: unknown[];
}

const ScriptDetailsInfo: FC<ScriptDetailsInfoProps> = ({
  script,
  scriptAttachments,
}) => {
  console.log(script);
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
        <InfoItem label="status" value={script.status} />
      </Row>
      <Row className="u-no-padding">
        <InfoItem
          label="Date created"
          value={moment(script.created_at).format(DISPLAY_DATE_TIME_FORMAT)}
        />
      </Row>
      <Row className="u-no-padding">
        <InfoItem
          label="Last modified"
          value={moment(script.last_edited_at).format(DISPLAY_DATE_TIME_FORMAT)}
        />
      </Row>

      {/* {scriptAttachments
        ? scriptAttachments.map((attachment, idx) => (
            <div key={idx} style={{ marginBottom: "1rem" }}>
              test
             </div>
          ))
        : null} */}

      <div>
        {/* {script.script_profiles.map((profile) => (
          <Link to={`/scripts/profiles/${profile.id}`} key={profile.id}>
            {profile.title}
          </Link>
        ))} */}
      </div>

      {/* <InfoItem
        label="Employee groups associated"
        value={script.groups.map((group) => group.name).join(", ")}
      /> */}
    </>
  );
};

export default ScriptDetailsInfo;
