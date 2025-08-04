import ListActions from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { useBoolean } from "usehooks-ts";
import type { WslProfile } from "../../types";
import WslProfileRemoveModal from "../WslProfileRemoveModal";

const WslProfileEditForm = lazy(async () => import("../WslProfileEditForm"));

interface WslProfilesListActionsProps {
  readonly profile: WslProfile;
}

const WslProfilesListActions: FC<WslProfilesListActionsProps> = ({
  profile,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const {
    value: isRemoveModalOpen,
    setTrue: openRemoveModal,
    setFalse: closeRemoveModal,
  } = useBoolean();

  const handleWslProfileEdit = () => {
    setSidePanelContent(
      `Edit "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <WslProfileEditForm profile={profile} />
      </Suspense>,
    );
  };

  const actions: Action[] = [
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit ${profile.title} profile`,
      onClick: handleWslProfileEdit,
    },
  ];

  const destructiveActions: Action[] = [
    {
      icon: "delete",
      label: "Remove",
      "aria-label": `Remove ${profile.title} profile`,
      onClick: openRemoveModal,
    },
  ];

  return (
    <>
      <ListActions
        toggleAriaLabel={`${profile.title} profile actions`}
        actions={actions}
        destructiveActions={destructiveActions}
      />

      <WslProfileRemoveModal
        isOpen={isRemoveModalOpen}
        close={closeRemoveModal}
        wslProfile={profile}
      />
    </>
  );
};

export default WslProfilesListActions;
