import { Button, Icon } from "@canonical/react-components";
import { type FC } from "react";
import { useBoolean } from "usehooks-ts";
import RemoveProfileModal from "../../../RemoveProfileModal";
import type { Profile, ProfileType } from "../../../../types";
import { ResponsiveButtons } from "@/components/ui";
import type { Action } from "@/types/Action";
import classes from "./ViewProfileActionsBlock.module.scss";
import { useGetProfileActions } from "../../../../hooks/useGetProfileActions";
import { isSecurityProfile } from "../../../../helpers";

interface ViewProfileActionsBlockProps {
  readonly profile: Profile;
  readonly type: ProfileType;
}

const ViewProfileActionsBlock: FC<ViewProfileActionsBlockProps> = ({
  profile,
  type,
}) => {
  const {
    value: modalOpen,
    setTrue: handleOpenModal,
    setFalse: handleCloseModal,
  } = useBoolean();

  const { actions, destructiveActions } = useGetProfileActions({ profile, type, handleOpenModal });
  const buttons = destructiveActions ? [...actions, ...destructiveActions] : actions;
  const isNegative = (action: Action) => action.appearance === "negative";  

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
            <Icon name={isNegative(button) ? `${button.icon}--negative` : button.icon} />
            <span className={isNegative(button) ? "u-text--negative" : ""}>{button.label}</span>
          </Button>
        ))}
        collapseFrom={isSecurityProfile(profile) ? "xxl" : "xs"}
      />

      <RemoveProfileModal
        closeModal={handleCloseModal}
        opened={modalOpen}
        profile={profile}
        type={type}
      />
    </>
  );
};

export default ViewProfileActionsBlock;
