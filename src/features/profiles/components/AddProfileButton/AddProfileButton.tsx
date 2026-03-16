import { Button, Icon } from "@canonical/react-components";
import { type FC } from "react";
import useProfiles from "@/hooks/useProfiles"; 
import usePageParams from "@/hooks/usePageParams";
import type { ProfileTypes } from "../../helpers";

interface AddProfileButtonProps {
  readonly type: ProfileTypes;
  readonly isInsideScriptHeader?: boolean;
}

const AddProfileButton: FC<AddProfileButtonProps> = ({ type, isInsideScriptHeader = false }) => {
  const { createPageParamsSetter } = usePageParams();
  const { isProfileLimitReached } = useProfiles();
  
  const settings = isInsideScriptHeader ? {
    className: "u-no-margin--bottom",
    icon: <Icon name="plus" />,
    hasIcon: true,
  } : {
    appearance: "positive",
    typeText: type,
  };

  return (
    <Button
      type="button"
      appearance={settings.appearance}
      className={settings.className}
      onClick={createPageParamsSetter({ sidePath: ["add"] })}
      hasIcon={settings.hasIcon}
      disabled={isProfileLimitReached}
    >
      {settings.icon}
      <span>Add {settings.typeText} profile</span>
    </Button>
  );
};

export default AddProfileButton;
