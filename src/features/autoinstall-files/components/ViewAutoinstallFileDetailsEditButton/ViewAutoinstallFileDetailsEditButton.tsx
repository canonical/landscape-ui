import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import { EDIT_BUTTON_TEXT } from "./constants";

const ViewAutoinstallFileDetailsEditButton: FC<{
  readonly openEditPanel: () => void;
}> = ({ openEditPanel }) => {
  return (
    <>
      <Button className="p-segmented-control__button" onClick={openEditPanel}>
        <Icon name="edit" />
        <span>{EDIT_BUTTON_TEXT}</span>
      </Button>
    </>
  );
};

export default ViewAutoinstallFileDetailsEditButton;
