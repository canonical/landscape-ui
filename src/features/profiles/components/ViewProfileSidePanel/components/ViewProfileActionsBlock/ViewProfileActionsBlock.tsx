import { Button, Icon, Notification } from "@canonical/react-components";
import { lazy, type FC } from "react";
import { useBoolean } from "usehooks-ts";
import type { Profile } from "../../../../types";
import { ResponsiveButtons } from "@/components/ui";
import type { Action } from "@/types/Action";
import classes from "./ViewProfileActionsBlock.module.scss";
import { useGetProfileActions } from "../../../../hooks/useGetProfileActions";
import { isScriptProfile, type ProfileTypes } from "../../../../helpers";
import moment from "moment";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";

const RemoveProfileModal = lazy(
  async () => import("../../../RemoveProfileModal"),
);

interface ViewProfileActionsBlockProps {
  readonly profile: Profile;
  readonly type: ProfileTypes;
}

const ViewProfileActionsBlock: FC<ViewProfileActionsBlockProps> = ({
  profile,
  type,
}) => {
  const {
    value: modalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const { actions, destructiveActions } = useGetProfileActions({
    profile,
    type,
    openModal,
  });
  const buttons = [...actions, ...(destructiveActions ?? [])];
  const isNegative = (action: Action) => action.appearance === "negative";

  if (isScriptProfile(profile) && profile.archived) {
    return (
      <Notification inline title="Profile archived:" severity="caution">
        The profile was archived on{" "}
        {moment(profile.last_edited_at).format(DISPLAY_DATE_TIME_FORMAT)}.
      </Notification>
    );
  }

  return (
    <>
      <ResponsiveButtons
        className={classes.actions}
        buttons={buttons.map((button) => (
          <Button
            key={button.label}
            hasIcon
            type="button"
            onClick={button.onClick}
            aria-label={`${button.label} ${profile.title} ${type} profile`}
            disabled={button.disabled}
          >
            <Icon
              name={
                isNegative(button) ? `${button.icon}--negative` : button.icon
              }
            />
            <span className={isNegative(button) ? "u-text--negative" : ""}>
              {button.label}
            </span>
          </Button>
        ))}
        collapseFrom={"xs"}
        alwaysCollapse={buttons.length > 3}
        menuPosition="left"
      />

      <RemoveProfileModal
        closeModal={closeModal}
        opened={modalOpen}
        profile={profile}
        type={type}
      />
    </>
  );
};

export default ViewProfileActionsBlock;
