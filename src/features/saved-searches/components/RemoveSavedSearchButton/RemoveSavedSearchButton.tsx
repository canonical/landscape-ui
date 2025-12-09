import { ConfirmationButton, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
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
    }
  };

  return (
    <ConfirmationButton
      className="has-icon u-no-margin--bottom u-no-padding--bottom u-no-padding--top"
      type="button"
      appearance="base"
      aria-label={`Remove ${savedSearch.title} saved search`}
      confirmationModalProps={{
        title: "Remove saved search",
        children: (
          <p>
            This will remove the saved search &quot;{savedSearch.title}
            &quot;.
          </p>
        ),
        confirmButtonLabel: "Remove",
        confirmButtonAppearance: "negative",
        confirmButtonDisabled: isRemovingSavedSearch,
        confirmButtonLoading: isRemovingSavedSearch,
        onConfirm: () => handleSavedSearchRemove(savedSearch.name),
      }}
    >
      <Icon name={ICONS.delete} />
    </ConfirmationButton>
  );
};

export default RemoveSavedSearchButton;
