import usePageParams from "@/hooks/usePageParams";
import { Button, ConfirmationModal } from "@canonical/react-components";
import { type FC } from "react";
import { useBoolean } from "usehooks-ts";
import { LOCAL_STORAGE_ITEM } from "./constants";

interface WslProfileAddButtonProps {
  readonly disabled?: boolean;
}

const WslProfileAddButton: FC<WslProfileAddButtonProps> = ({ disabled }) => {
  const { createPageParamsSetter } = usePageParams();

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
    profile: "",
  });

  const handleClick = () => {
    if (isModalRead) {
      openAddSidePanel();
    } else {
      openModal();
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
        appearance="positive"
        onClick={handleClick}
        disabled={disabled}
      >
        Add WSL profile
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

export default WslProfileAddButton;
