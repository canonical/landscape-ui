import SearchQueryEditor from "@/components/filter/SearchQueryEditor";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import {
  getProfileTypes,
  useInstanceSearchHelpTerms,
} from "@/features/instances";
import useAuth from "@/hooks/useAuth";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useMemo, useState } from "react";
import { USG_STATUSES, WSL_STATUSES } from "./constants";
import { configureSearchLanguage } from "./helpers/searchQueryLanguage";
import { VALIDATION_SCHEMA } from "./helpers/searchQuerySchema";
import { validateSearchQuery } from "./helpers/searchQueryValidation";
import type { FormProps } from "./types";

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
  const { isFeatureEnabled } = useAuth();

  const isScriptProfilesEnabled = isFeatureEnabled("script-profiles");
  const isUsgProfilesEnabled = isFeatureEnabled("usg-profiles");
  const isWslProfilesEnabled = isFeatureEnabled("wsl-child-instance-profiles");

  const validationConfig = useMemo(
    () => ({
      profileTypes: getProfileTypes({
        isScriptProfilesEnabled,
        isUsgProfilesEnabled,
        isWslProfilesEnabled,
      }),
      usgStatuses: isUsgProfilesEnabled ? USG_STATUSES : [],
      wslStatuses: isWslProfilesEnabled ? WSL_STATUSES : [],
    }),
    [isScriptProfilesEnabled, isUsgProfilesEnabled, isWslProfilesEnabled],
  );

  const hasInitialSearch = Boolean(initialValues.search?.trim());

  const initialSearchWarning = hasInitialSearch
    ? validateSearchQuery(initialValues.search, true, validationConfig)
    : undefined;

  const [searchWarning, setSearchWarning] = useState<string | undefined>(
    initialSearchWarning,
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
              .map((part) => part.split(":")[0]?.split(".")[0])
              .filter((part) => part !== undefined),
          ),
        ),
      ),
    [instanceSearchHelpTerms],
  );

  const handleSearchBlur = () => {
    formik.setFieldTouched("search", true, false);
    setSearchWarning(
      validateSearchQuery(formik.values.search, true, validationConfig),
    );
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchWarning(
      validateSearchQuery(formik.values.search, true, validationConfig),
    );
    formik.handleSubmit();
  };

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
        languageConfig={validationConfig}
        onChange={(value) => {
          const newValue = value ?? "";

          formik.setFieldValue("search", newValue);
          formik.setFieldTouched("search", true, false);

          setSearchWarning(
            validateSearchQuery(newValue, false, validationConfig),
          );
        }}
        error={getFormikError(formik, "search")}
        warning={searchWarning}
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
        submitButtonDisabled={formik.isSubmitting}
        hasBackButton={Boolean(onBackButtonPress)}
        onBackButtonPress={onBackButtonPress}
      />
    </Form>
  );
};

export default SavedSearchForm;
