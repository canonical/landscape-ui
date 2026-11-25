import { Button } from "@canonical/react-ds-global";
import { type FC } from "react";
import useProfiles from "@/hooks/useProfiles";
import usePageParams from "@/hooks/usePageParams";

interface AddProfileButtonProps {
  readonly isInsideScriptHeader?: boolean;
}

const AddProfileButton: FC<AddProfileButtonProps> = ({
  isInsideScriptHeader = false,
}) => {
  const { createPageParamsSetter } = usePageParams();
  const { isProfileLimitReached } = useProfiles();

  const openAddSidePanel = createPageParamsSetter({
    sidePath: ["add"],
    name: "",
  });

  return (
    <Button
      type="button"
      importance={isInsideScriptHeader ? "secondary" : "primary"}
      anticipation={isInsideScriptHeader ? undefined : "constructive"}
      icon="plus"
      onClick={openAddSidePanel}
      disabled={isProfileLimitReached}
    >
      Add profile
    </Button>
  );
};

export default AddProfileButton;
