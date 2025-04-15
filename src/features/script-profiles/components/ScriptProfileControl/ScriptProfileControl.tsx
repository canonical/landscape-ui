import { Button, Icon, Notification } from "@canonical/react-components";
import type { FC } from "react";
import type { ScriptProfile } from "../../types";

interface ScriptProfileControlProps {
  readonly actions: {
    archive: () => void;
    edit: () => void;
  };
  readonly profile: ScriptProfile;
}

const ScriptProfileControl: FC<ScriptProfileControlProps> = ({
  actions,
  profile,
}) => {
  if (profile.archived) {
    return (
      <Notification inline title="Profile archived:" severity="caution">
        The profile was archived on {profile.modified_at} GMT.
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
          onClick={actions.edit}
        >
          <Icon name="edit" />
          <span>Edit</span>
        </Button>

        <Button
          className="p-segmented-control__button"
          type="button"
          hasIcon
          onClick={actions.archive}
        >
          <Icon name="archive" />
          <span>Archive</span>
        </Button>
      </div>
    </div>
  );
};

export default ScriptProfileControl;
