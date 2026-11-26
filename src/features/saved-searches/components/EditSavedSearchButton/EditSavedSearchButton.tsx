import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-ds-global";
import { lazy, Suspense, type FC } from "react";
import { useEditSavedSearch } from "../../api";
import type { SavedSearch } from "../../types";
import type { FormProps } from "../SavedSearchForm";
import { SIDEPANEL_SIZE } from "../../constants";

const SavedSearchForm = lazy(async () => import("../SavedSearchForm"));

interface EditSavedSearchButtonProps {
  readonly savedSearch: SavedSearch;
  readonly onBackButtonPress?: () => void;
}

const EditSavedSearchButton: FC<EditSavedSearchButtonProps> = ({
  savedSearch,
  onBackButtonPress,
}) => {
  const { editSavedSearch } = useEditSavedSearch();
  const { notify } = useNotify();
  const debug = useDebug();
  const { setSidePanelContent, closeSidePanel } = useSidePanel();

  const handleSubmit = async (values: FormProps) => {
    try {
      await editSavedSearch({
        name: savedSearch.name,
        title: savedSearch.title,
        search: values.search,
      });

      closeSidePanel();

      notify.success({
        title: "Saved search updated",
        message: `The saved search "${values.title}" has been updated successfully.`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleEditClick = () => {
    const sidePanelSize = onBackButtonPress && SIDEPANEL_SIZE;

    setSidePanelContent(
      `Edit "${savedSearch.title}" saved search`,
      <Suspense fallback={<LoadingState />}>
        <SavedSearchForm
          mode="edit"
          initialValues={{
            title: savedSearch.title,
            search: savedSearch.search,
          }}
          onSubmit={handleSubmit}
          onBackButtonPress={onBackButtonPress}
        />
      </Suspense>,
      sidePanelSize,
    );
  };

  return (
    <Button
      type="button"
      title="Edit"
      importance="tertiary"
      icon="edit"
      aria-label={`Edit ${savedSearch.title} saved search`}
      onClick={handleEditClick}
    />
  );
};

export default EditSavedSearchButton;
