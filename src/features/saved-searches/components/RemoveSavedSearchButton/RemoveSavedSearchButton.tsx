import { ConfirmationModal } from "@canonical/react-components";
import { Button } from "@canonical/react-ds-global";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useRemoveSavedSearch } from "../../api";
import useNotify from "@/hooks/useNotify";
import useDebug from "@/hooks/useDebug";
import type { SavedSearch } from "../../types";

interface RemoveSavedSearchButtonProps {
  readonly savedSearch: SavedSearch;
  readonly onSavedSearchRemove?: () => void;
}

const RemoveSavedSearchButton: FC<RemoveSavedSearchButtonProps> = ({
  savedSearch,
  onSavedSearchRemove,
}) => {
  const { removeSavedSearch, isRemovingSavedSearch } = useRemoveSavedSearch();
  const { notify } = useNotify();
  const debug = useDebug();
  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean(false);

  const handleSavedSearchRemove = async (name: string) => {
    try {
      await removeSavedSearch({ name });

      if (onSavedSearchRemove) {
        onSavedSearchRemove();
      }

      notify.success({
        message: `Saved search ${name} successfully removed`,
        title: "Saved search removed",
      });
    } catch (error) {
      debug(error);
    } finally {
      closeModal();
    }
  };

  return (
    <>
      <Button
        type="button"
        title="Remove"
        importance="tertiary"
        icon="delete"
        aria-label={`Remove ${savedSearch.title} saved search`}
        onClick={openModal}
      />
      {isModalOpen && (
        <ConfirmationModal
          renderInPortal
          title="Remove saved search"
          confirmButtonLabel="Remove"
          confirmButtonAppearance="negative"
          confirmButtonDisabled={isRemovingSavedSearch}
          confirmButtonLoading={isRemovingSavedSearch}
          onConfirm={() => handleSavedSearchRemove(savedSearch.name)}
          close={closeModal}
        >
          <p className="u-margin--bottom">
            This will remove the saved search &quot;{savedSearch.title}
            &quot;.
          </p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default RemoveSavedSearchButton;
