import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import { lazy, Suspense, type FC } from "react";
import type { ProfileType } from "../../types";

const ManageProfileForm = lazy(
  () => import("@/features/profiles/components/ManageProfileForm"),
);

interface AddProfileButtonProps {
  readonly type: ProfileType;
}

const AddProfileButton: FC<AddProfileButtonProps> = ({ type }) => {
  const { setSidePanelContent } = useSidePanel();

  const handleAddProfile = () => {
    setSidePanelContent(
      `Add ${type} profile`,
      <Suspense fallback={<LoadingState />}>
        <ManageProfileForm type={type} action="add" />
      </Suspense>,
    );
  };

  return (
    <Button appearance="positive" onClick={handleAddProfile} type="button">
      Add {type} profile
    </Button>
  );
};

export default AddProfileButton;
