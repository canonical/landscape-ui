import { Button } from "@canonical/react-components";
import { type FC } from "react";
import type { ProfileType } from "../../types";
import { useOpenManageProfileForm } from "../../hooks/useOpenManageProfileForm";

interface AddProfileButtonProps {
  readonly type: ProfileType;
}

const AddProfileButton: FC<AddProfileButtonProps> = ({ type }) => {
  const openManageProfileForm = useOpenManageProfileForm();

  return (
    <Button appearance="positive" onClick={() => { openManageProfileForm({ type, action: "add" }); }} type="button">
      Add {type} profile
    </Button>
  );
};

export default AddProfileButton;
