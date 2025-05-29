import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { useIsSecurityProfilesLimitReached } from "../../api";

const SecurityProfileAddForm = lazy(
  async () =>
    import("@/features/security-profiles/components/SecurityProfileAddForm"),
);

interface AddSecurityProfileButtonProps {
  readonly onAddProfile: () => void;
}

const AddSecurityProfileButton: FC<AddSecurityProfileButtonProps> = ({
  onAddProfile,
}) => {
  const { setSidePanelContent } = useSidePanel();
  const profileLimitReached = useIsSecurityProfilesLimitReached();

  const addSecurityProfile = () => {
    setSidePanelContent(
      "Add security profile",
      <Suspense fallback={<LoadingState />}>
        <SecurityProfileAddForm onSuccess={onAddProfile} />
      </Suspense>,
    );
  };

  return (
    <Button
      type="button"
      appearance="positive"
      onClick={addSecurityProfile}
      disabled={profileLimitReached}
    >
      Add security profile
    </Button>
  );
};

export default AddSecurityProfileButton;
