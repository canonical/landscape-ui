import { Button, ConfirmationModal, Icon } from "@canonical/react-components";
import { type FC } from "react";
import { useLocation } from "react-router";
import useProfiles from "@/hooks/useProfiles";
import usePageParams from "@/hooks/usePageParams";
import { useBoolean } from "usehooks-ts";
import { PROFILES_PATHS } from "@/libs/routes/profiles";

const LOCAL_STORAGE_ITEM = "_landscape_isWslPopupClosed";

interface AddProfileButtonProps {
  readonly isInsideScriptHeader?: boolean;
}

const AddProfileButton: FC<AddProfileButtonProps> = ({
  isInsideScriptHeader = false,
}) => {
  const { pathname } = useLocation();
  const isWsl = pathname.includes(`/${PROFILES_PATHS.wsl}`);
  const { createPageParamsSetter } = usePageParams();
  const { isProfileLimitReached } = useProfiles();

  const settings = isInsideScriptHeader
    ? { className: "u-no-margin--bottom" }
    : { appearance: "positive", light: true };

  const { value: isModalRead, setTrue: readModal } = useBoolean(
    !!localStorage.getItem(LOCAL_STORAGE_ITEM),
  );

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const openAddSidePanel = createPageParamsSetter({
    sidePath: ["add"],
    name: "",
  });

  const handleClick = () => {
    if (isWsl && !isModalRead) {
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
        hasIcon
        disabled={isProfileLimitReached}
      >
        <Icon name="plus" light={settings.light} />
        <span>Add profile</span>
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
