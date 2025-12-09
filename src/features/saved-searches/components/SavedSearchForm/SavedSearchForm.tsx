import { getFormikError } from "@/utils/formikErrors";
import { Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useMemo, useState } from "react";
import SearchQueryEditor from "@/components/filter/SearchQueryEditor";
import { useInstanceSearchHelpTerms } from "@/features/instances";
import type { FormProps } from "./types";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { VALIDATION_SCHEMA } from "./helpers/searchQuerySchema";
import { validateSearchField } from "./helpers/searchQueryValidation";
import { configureSearchLanguage } from "./helpers/searchQueryLanguage";

const INSTANCE_SEARCH_LANGUAGE_ID = "instance-search-query";

interface SavedSearchFormProps {
  readonly initialValues: FormProps;
  readonly onSubmit: (values: FormProps) => Promise<void>;
  readonly mode: "create" | "edit";
  readonly onBackButtonPress?: () => void;
}

const SavedSearchForm: FC<SavedSearchFormProps> = ({
  initialValues,
  onSubmit,
  mode,
  onBackButtonPress,
}) => {
  const instanceSearchHelpTerms = useInstanceSearchHelpTerms();

  const hasInitialSearch = Boolean(initialValues.search?.trim());

  const initialSearchError = hasInitialSearch
    ? validateSearchField(initialValues.search, "strict")
    : undefined;

  const [searchError, setSearchError] = useState<string | undefined>(
    initialSearchError,
  );

  const formik = useFormik<FormProps>({
    initialValues,
    validationSchema: VALIDATION_SCHEMA,
    enableReinitialize: true,
    validateOnMount: true,
    initialTouched: {
      title: false,
      search: hasInitialSearch,
    },
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  const searchTerms = useMemo(
    () =>
      Array.from(
        new Set(
          instanceSearchHelpTerms.flatMap(({ term }) =>
            term
              .split(/\s+OR\s+/i)
              .map((part) => part.split(":")[0])
              .filter(Boolean),
          ),
        ),
      ),
    [instanceSearchHelpTerms],
  );

  const handleSearchBlur = () => {
    formik.setFieldTouched("search", true, false);

    const strictError = validateSearchField(formik.values.search, "strict");
    setSearchError(strictError);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const strictSearchError = validateSearchField(
      formik.values.search,
      "strict",
    );
    setSearchError(strictSearchError);

    if (strictSearchError) {
      return;
    }

    formik.handleSubmit();
  };

  const submitDisabled =
    formik.isSubmitting ||
    !formik.values.search.trim() ||
    Boolean(formik.errors.title);

  return (
    <Form noValidate onSubmit={handleFormSubmit}>
      <Input
        type="text"
        label="Title"
        disabled={mode === "edit"}
        required
        {...formik.getFieldProps("title")}
        error={getFormikError(formik, "title")}
      />

      <SearchQueryEditor
        label="Search query"
        required
        value={formik.values.search}
        onBlur={handleSearchBlur}
        configureSearchLanguage={configureSearchLanguage}
        onChange={(value) => {
          const newValue = value ?? "";

          formik.setFieldValue("search", newValue);
          formik.setFieldTouched("search", true, false);

          const typingError = validateSearchField(newValue, "typing");
          setSearchError(typingError);
        }}
        error={formik.touched.search ? searchError : undefined}
        languageId={INSTANCE_SEARCH_LANGUAGE_ID}
        terms={searchTerms}
        options={{
          wordWrap: "on",
          automaticLayout: true,
          lineNumbers: "off",
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 0,
        }}
      />

      <SidePanelFormButtons
        submitButtonText={
          mode === "create" ? "Add saved search" : "Save changes"
        }
        submitButtonLoading={formik.isSubmitting}
        submitButtonDisabled={submitDisabled}
        hasBackButton={Boolean(onBackButtonPress)}
        onBackButtonPress={onBackButtonPress}
      />
    </Form>
  );
};

export default SavedSearchForm;
