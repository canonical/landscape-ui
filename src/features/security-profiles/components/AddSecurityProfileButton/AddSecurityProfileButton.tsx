import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useIsSecurityProfilesLimitReached } from "../../api";

const AddSecurityProfileButton: FC = () => {
  const { setPageParams } = usePageParams();
  const profileLimitReached = useIsSecurityProfilesLimitReached();

  const addSecurityProfile = () => {
    setPageParams({ sidePath: ["add"], profile: "" });
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
