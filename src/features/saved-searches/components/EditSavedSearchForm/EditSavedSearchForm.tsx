import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useEditSavedSearch, useGetSavedSearches } from "../../api";
import type { FormProps } from "../SavedSearchForm";
import SavedSearchForm from "../SavedSearchForm";

const EditSavedSearchForm: FC = () => {
  const { editSavedSearch } = useEditSavedSearch();
  const { savedSearches, isLoadingSavedSearches } = useGetSavedSearches();
  const { notify } = useNotify();
  const debug = useDebug();
  const { closeSidePanel, name } = usePageParams();

  if (isLoadingSavedSearches) {
    return <LoadingState />;
  }

  const savedSearch = savedSearches.find((s) => s.name === name);

  if (!savedSearch) {
    return <p>Saved search not found.</p>;
  }

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

  return (
    <SavedSearchForm
      mode="edit"
      initialValues={{
        title: savedSearch.title,
        search: savedSearch.search,
      }}
      onSubmit={handleSubmit}
    />
  );
};

export default EditSavedSearchForm;