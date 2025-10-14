import ListActions from "@/components/layout/ListActions";
import usePageParams from "@/hooks/usePageParams";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import type { PackageProfile } from "../../types";
import PackageProfileRemoveModal from "../PackageProfileRemoveModal";

interface PackageProfileListActionsProps {
  readonly profile: PackageProfile;
}

const PackageProfileListActions: FC<PackageProfileListActionsProps> = ({
  profile,
}) => {
  const { createPageParamsSetter } = usePageParams();

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const handleConstraintsChange = createPageParamsSetter({
    sidePath: ["edit-constraints"],
    profile: profile.name,
  });

  const handlePackageProfileEdit = createPageParamsSetter({
    sidePath: ["edit"],
    profile: profile.name,
  });

  const handlePackageProfileDuplicate = createPageParamsSetter({
    sidePath: ["duplicate"],
    profile: profile.name,
  });

  const actions: Action[] = [
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit ${profile.title} profile`,
      onClick: handlePackageProfileEdit,
    },
    {
      icon: "applications",
      label: "Change package constraints",
      "aria-label": `Change ${profile.title} package constraints`,
      onClick: handleConstraintsChange,
    },
    {
      icon: "canvas",
      label: "Duplicate",
      "aria-label": `Duplicate ${profile.title} profile`,
      onClick: handlePackageProfileDuplicate,
    },
  ];

  const destructiveActions: Action[] = [
    {
      icon: "delete",
      label: "Remove",
      "aria-label": `Remove ${profile.title} profile`,
      onClick: openModal,
    },
  ];

  return (
    <>
      <ListActions
        toggleAriaLabel={`${profile.title} profile actions`}
        actions={actions}
        destructiveActions={destructiveActions}
      />

      <PackageProfileRemoveModal
        close={closeModal}
        isOpen={isModalOpen}
        packageProfile={profile}
      />
    </>
  );
};

export default PackageProfileListActions;
