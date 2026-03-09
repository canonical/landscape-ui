import { Button, Icon } from "@canonical/react-components";
import { type FC } from "react";
import type { ProfileType } from "../../types";
import { useOpenManageProfileSidePanel } from "../../hooks/useOpenManageProfileSidePanel";

interface AddProfileButtonProps {
  readonly type: ProfileType;
  readonly disabled?: boolean;
  readonly isInsideScriptTab?: boolean;
}

const AddProfileButton: FC<AddProfileButtonProps> = ({ type, disabled = false, isInsideScriptTab = false }) => {
  const openManageProfileSidePanel = useOpenManageProfileSidePanel();
  
  const settings = isInsideScriptTab ? {
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
      onClick={() => { openManageProfileSidePanel({ type, action: "add" }); }}
      hasIcon={settings.hasIcon}
      disabled={disabled}
    >
      {settings.icon}
      <span>Add {settings.typeText} profile</span>
    </Button>
  );
};

export default AddProfileButton;
