import Menu from "@/components/layout/Menu";
import NoData from "@/components/layout/NoData";
import useRoles from "@/hooks/useRoles";
import type { FC } from "react";
import { Link } from "react-router";
import { formatTitleCase, getAuthorInfo } from "../../helpers";
import type { SingleScript } from "../../types";
import AttachmentFile from "../AttachmentFile";

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
      <Menu
        items={[
          { label: "Name", size: 6, value: script.title },
          {
            label: "Version",
            size: 6,
            value: script.version_number,
          },
          {
            label: "Status",
            size: 6,
            value: formatTitleCase(script.status),
          },
          { label: "Access group", size: 6, value: accessGroup },
          {
            label: "Date created",
            size: 12,
            value: getAuthorInfo({
              author: script.created_by.name,
              date: script.created_at,
            }),
          },
          {
            label: "Last modified",
            size: 12,
            value: getAuthorInfo({
              author: script.last_edited_by.name,
              date: script.last_edited_at,
            }),
          },
          {
            label: "Attachments",
            size: 12,
            value:
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
              ),
          },
          {
            label: "Associated profiles",
            size: 12,
            value:
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
              ),
          },
        ]}
      />
    </>
  );
};

export default ScriptDetailsInfo;
