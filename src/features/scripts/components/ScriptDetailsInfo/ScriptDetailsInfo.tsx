import InfoGrid from "@/components/layout/InfoGrid";
import StaticLink from "@/components/layout/StaticLink";
import useRoles from "@/hooks/useRoles";
import type { FC } from "react";
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
    <InfoGrid>
      <InfoGrid.Item label="Name" value={script.title} />

      <InfoGrid.Item label="Version" value={script.version_number} />

      <InfoGrid.Item label="Status" value={formatTitleCase(script.status)} />

      <InfoGrid.Item label="Access group" value={accessGroup} />

      <InfoGrid.Item
        label="Date created"
        large
        value={getAuthorInfo({
          author: script.created_by.name,
          date: script.created_at,
        })}
      />

      <InfoGrid.Item
        label="Last modified"
        large
        value={getAuthorInfo({
          author: script.last_edited_by.name,
          date: script.last_edited_at,
        })}
      />

      <InfoGrid.Item
        label="Attachments"
        large
        value={
          script.attachments.length > 0
            ? script.attachments.map((att) => (
                <AttachmentFile
                  key={att.id}
                  attachmentId={att.id}
                  filename={att.filename}
                  scriptId={script.id}
                />
              ))
            : null
        }
      />

      <InfoGrid.Item
        label="Associated profiles"
        large
        value={
          script.script_profiles.length > 0
            ? script.script_profiles.map((profile, index) => (
                <StaticLink
                  to={`/scripts?tab=profiles&sidePath=view&scriptProfile=${profile.id}`}
                  key={profile.id}
                >
                  {profile.title}
                  {index < script.script_profiles.length - 1 ? ", " : ""}{" "}
                </StaticLink>
              ))
            : null
        }
      />
    </InfoGrid>
  );
};

export default ScriptDetailsInfo;
