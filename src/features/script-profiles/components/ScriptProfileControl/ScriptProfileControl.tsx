import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import usePageParams from "@/hooks/usePageParams";
import { Button, Icon, Notification } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import type { ScriptProfile } from "../../types";
import ScriptProfileArchiveModal from "../ScriptProfileArchiveModal";

interface ScriptProfileControlProps {
  readonly profile: ScriptProfile;
}

const ScriptProfileControl: FC<ScriptProfileControlProps> = ({ profile }) => {
  const { createSidePathPusher } = usePageParams();

  const {
    value: archiveModalOpened,
    setTrue: openArchiveModal,
    setFalse: closeArchiveModal,
  } = useBoolean();

  if (profile.archived) {
    return (
      <Notification inline title="Profile archived:" severity="caution">
        The profile was archived on{" "}
        {moment(profile.last_edited_at).format(DISPLAY_DATE_TIME_FORMAT)}.
      </Notification>
    );
  }

  return (
    <div className="p-segmented-control">
      <div className="p-segmented-control__list">
        <Button
          className="p-segmented-control__button"
          type="button"
          hasIcon
          onClick={createSidePathPusher("edit")}
        >
          <Icon name="edit" />
          <span>Edit</span>
        </Button>

        <Button
          className="p-segmented-control__button"
          type="button"
          hasIcon
          onClick={openArchiveModal}
        >
          <Icon name="archive" />
          <span>Archive</span>
        </Button>
      </div>

      <ScriptProfileArchiveModal
        opened={archiveModalOpened}
        onClose={closeArchiveModal}
        profile={profile}
      />
    </div>
  );
};

export default ScriptProfileControl;
