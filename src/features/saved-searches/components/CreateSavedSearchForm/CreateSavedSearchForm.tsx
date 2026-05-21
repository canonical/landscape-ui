import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useCreateSavedSearch } from "../../api";
import type { FormProps } from "../SavedSearchForm";
import SavedSearchForm from "../SavedSearchForm";

const CreateSavedSearchForm: FC = () => {
  const { createSavedSearch } = useCreateSavedSearch();
  const { notify } = useNotify();
  const debug = useDebug();
  const { closeSidePanel, query } = usePageParams();

  const handleSubmit = async (values: FormProps) => {
    try {
      await createSavedSearch({
        title: values.title,
        search: values.search,
      });

      closeSidePanel();

      notify.success({
        title: "Saved search created",
        message: `The saved search "${values.title}" has been created successfully.`,
      });
    } catch (error) {
      debug(error);
    }
  };

  return (
    <SavedSearchForm
      mode="create"
      initialValues={{
        title: "",
        search: query || "",
      }}
      onSubmit={handleSubmit}
    />
  );
};

export default CreateSavedSearchForm;