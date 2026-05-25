import { Button, Icon } from "@canonical/react-components";
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

  const settings = isInsideScriptHeader
    ? { className: "u-no-margin--bottom" }
    : { appearance: "positive", light: true };

  const openAddSidePanel = createPageParamsSetter({
    sidePath: ["add"],
    name: "",
  });

  return (
    <Button
      type="button"
      appearance={settings.appearance}
      className={settings.className}
      onClick={openAddSidePanel}
      hasIcon
      disabled={isProfileLimitReached}
    >
      <Icon name="plus" light={settings.light} />
      <span>Add profile</span>
    </Button>
  );
};

export default AddProfileButton;
