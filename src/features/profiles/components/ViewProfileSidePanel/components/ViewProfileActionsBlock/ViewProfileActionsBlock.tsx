import { Button, Icon } from "@canonical/react-components";
import { type FC } from "react";
import { useBoolean } from "usehooks-ts";
import RemoveProfileModal from "../../../RemoveProfileModal";
import type { Profile, ProfileType } from "../../../../types";
import { ResponsiveButtons } from "@/components/ui";
import type { Action } from "@/types/Action";
import classes from "./ViewProfileActionsBlock.module.scss";
import { useGetProfileActions } from "../../../../hooks/useGetProfileActions";

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

  const actions = useGetProfileActions({ profile, type, handleOpenModal });
  const isNegative = (action: Action) => action.appearance === "negative";  

  return (
    <>
      <ResponsiveButtons
        className={classes.actions}
        buttons={actions.map((action) => (
          <Button
            key={action.label}
            hasIcon
            type="button"
            onClick={action.onClick}
            aria-label={`${action.label} ${profile.title} ${type} profile`}
          >
            <Icon name={isNegative(action) ? `${action.icon}--negative` : action.icon} />
            <span className={isNegative(action) ? "u-text--negative" : ""}>{action.label}</span>
          </Button>
        ))}
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
