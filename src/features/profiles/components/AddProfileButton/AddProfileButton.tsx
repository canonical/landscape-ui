import { Button, ConfirmationModal, Icon } from "@canonical/react-components";
import { type FC } from "react";
import useProfiles from "@/hooks/useProfiles";
import usePageParams from "@/hooks/usePageParams";
import { ProfileTypes } from "../../helpers";
import { useBoolean } from "usehooks-ts";

const LOCAL_STORAGE_ITEM = "_landscape_isWslPopupClosed";

interface AddProfileButtonProps {
  readonly type: ProfileTypes;
  readonly isInsideScriptHeader?: boolean;
}

const AddProfileButton: FC<AddProfileButtonProps> = ({
  type,
  isInsideScriptHeader = false,
}) => {
  const { createPageParamsSetter } = usePageParams();
  const { isProfileLimitReached } = useProfiles();

  const settings = isInsideScriptHeader
    ? {
        className: "u-no-margin--bottom",
        icon: <Icon name="plus" />,
        hasIcon: true,
      }
    : {
        appearance: "positive",
        typeText: type,
      };
  
  const { value: isModalRead, setTrue: readModal } = useBoolean(
    !!localStorage.getItem(LOCAL_STORAGE_ITEM),
  );

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const openAddSidePanel = createPageParamsSetter({
    sidePath: ["add"]
  });

  const handleClick = () => {
    if (type === ProfileTypes.wsl && !isModalRead) {
      openModal();
    } else {
      openAddSidePanel();
    }
  };

  const handleConfirm = () => {
    closeModal();
    openAddSidePanel();
    localStorage.setItem(LOCAL_STORAGE_ITEM, "true");
    readModal();
  };

  return (
    <>
      <Button
        type="button"
        appearance={settings.appearance}
        className={settings.className}
        onClick={handleClick}
        hasIcon={settings.hasIcon}
        disabled={isProfileLimitReached}
      >
        {settings.icon}
        <span>Add {settings.typeText} profile</span>
      </Button>
  
      {isModalOpen && (
        <ConfirmationModal
          close={closeModal}
          title="WSL profiles is a beta feature"
          onConfirm={handleConfirm}
          confirmButtonLabel="Add WSL profile"
          confirmButtonAppearance="positive"
        >
          <p>We are gathering feedback to improve this feature.</p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default AddProfileButton;
