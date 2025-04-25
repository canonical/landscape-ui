import InfoItem from "@/components/layout/InfoItem";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { Button, Col, Icon, Row, Tooltip } from "@canonical/react-components";
import moment from "moment";
import { useEffect, useState, type FC } from "react";
import type { SingleScript } from "../../types";
import { Link } from "react-router";
import { useGetSingleScriptAttachment } from "../../api";
import classes from "./ScriptDetailsInfo.module.scss";
import { formatTitleCase } from "../../helpers";
import NoData from "@/components/layout/NoData";
import classNames from "classnames";

interface ScriptDetailsInfoProps {
  readonly script: SingleScript;
}

const ScriptDetailsInfo: FC<ScriptDetailsInfoProps> = ({ script }) => {
  const [selectedAttachment, setSelectedAttachment] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const { isScriptAttachmentsLoading, refetch } = useGetSingleScriptAttachment(
    {
      attachmentId: selectedAttachment?.id ?? 0,
      scriptId: script.id,
    },
    {
      enabled: false,
    },
  );

  useEffect(() => {
    const fetchAndDownload = async () => {
      if (!selectedAttachment) {
        return;
      }

      const { data } = await refetch();
      if (!data) {
        return;
      }

      const blob = new Blob([data.data], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = selectedAttachment.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setSelectedAttachment(null);
    };

    fetchAndDownload();
  }, [selectedAttachment, refetch]);

  const handleDownload = async (id: number, name: string) => {
    setSelectedAttachment({ id, name });
  };

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
        <InfoItem label="status" value={formatTitleCase(script.status)} />
      </Row>
      <Row className="u-no-padding">
        <InfoItem
          label="Date created"
          value={`${moment(script.created_at).format(DISPLAY_DATE_TIME_FORMAT)} by ${script.created_by.name}`}
        />
      </Row>
      <Row className="u-no-padding">
        <InfoItem
          label="Last modified"
          value={`${moment(script.last_edited_at).format(DISPLAY_DATE_TIME_FORMAT)} by ${script.last_edited_by.name}`}
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
                  <span key={att.id} className={classes.attachment}>
                    <span>{att.filename}</span>
                    <Tooltip message="Download">
                      <Button
                        className={classNames(
                          "u-no-margin--bottom",
                          classes.downloadButton,
                        )}
                        type="button"
                        onClick={async () =>
                          handleDownload(att.id, att.filename)
                        }
                        disabled={
                          isScriptAttachmentsLoading &&
                          selectedAttachment?.id === att.id
                        }
                        appearance="link"
                        aria-label={`Download ${att.filename}`}
                      >
                        <Icon name="begin-downloading" />
                      </Button>
                    </Tooltip>
                  </span>
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
                className={classes.link}
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
