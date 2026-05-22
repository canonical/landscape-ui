import usePageParams from "@/hooks/usePageParams";
import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import type { SavedSearch } from "../../types";

interface EditSavedSearchButtonProps {
  readonly savedSearch: SavedSearch;
}

const EditSavedSearchButton: FC<EditSavedSearchButtonProps> = ({
  savedSearch,
}) => {
  const { setPageParams, sidePath } = usePageParams();

  return (
    <Button
      type="button"
      title="Edit"
      appearance="base"
      aria-label={`Edit ${savedSearch.title} saved search`}
      onClick={() => {
        setPageParams({
          sidePath: [...sidePath, "edit-saved-search"],
          name: savedSearch.name,
        });
      }}
      className="has-icon u-no-margin--bottom u-no-margin--right"
    >
      <Icon name="edit" />
    </Button>
  );
};

export default EditSavedSearchButton;
