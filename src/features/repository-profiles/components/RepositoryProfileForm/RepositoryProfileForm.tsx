import { useFormik } from "formik";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { Form } from "@canonical/react-components";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import RepositoryProfileFormAptSourcesPanel from "../RepositoryProfileFormAptSourcesPanel";
import RepositoryProfileFormDetailsPanel from "../RepositoryProfileFormDetailsPanel";
import RepositoryProfileFormPocketsPanel from "../RepositoryProfileFormPocketsPanel";
import RepositoryProfileFormTabs from "../RepositoryProfileFormTabs";
import type { CreateRepositoryProfileParams } from "../../hooks";
import { useRepositoryProfiles } from "../../hooks";
import type {
  RepositoryProfile,
  RepositoryProfileFormValues,
} from "../../types";
import { useAPTSources } from "@/features/apt-sources";
import useDebug from "@/hooks/useDebug";
import { useDistributions } from "@/features/mirrors";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import { CTA_INFO, INITIAL_VALUES } from "./constants";
import { getValidationSchema } from "./helpers";
import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";

type RepositoryProfileFormProps =
  | {
      action: "add";
    }
  | {
      action: "edit";
      profile: RepositoryProfile;
    };

const RepositoryProfileForm: FC<RepositoryProfileFormProps> = (props) => {
  const [currentTab, setCurrentTab] = useState(0);

  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();

  const { getDistributionsQuery } = useDistributions();
  const { getAccessGroupQuery } = useRoles();
  const { getAPTSourcesQuery } = useAPTSources();
  const { createRepositoryProfileQuery, editRepositoryProfileQuery } =
    useRepositoryProfiles();

  const { data: getDistributionsResult } = getDistributionsQuery();
  const { data: getAPTSourcesResult } = getAPTSourcesQuery();
  const { data: accessGroupsResult } = getAccessGroupQuery(
    {},
    { enabled: props.action === "add" },
  );

  const { mutateAsync: createRepositoryProfile } = createRepositoryProfileQuery;
  const { mutateAsync: editRepositoryProfile } = editRepositoryProfileQuery;

  const handleSubmit = async (values: RepositoryProfileFormValues) => {
    const valuesToSubmit: CreateRepositoryProfileParams = {
      all_computers: values.all_computers,
      apt_sources: values.apt_sources,
      description: values.description,
      pockets: values.pockets,
      title: values.title,
    };

    if (!values.all_computers) {
      valuesToSubmit.tags = values.tags;
    }

    try {
      if (props.action === "add") {
        await createRepositoryProfile({
          access_group: values.access_group,
          ...valuesToSubmit,
        });
      } else {
        await editRepositoryProfile({
          name: props.profile.name,
          ...valuesToSubmit,
        });
      }

      closeSidePanel();
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik<RepositoryProfileFormValues>({
    initialValues: INITIAL_VALUES,
    onSubmit: handleSubmit,
    validationSchema: getValidationSchema(props.action),
  });

  useEffect(() => {
    if (props.action !== "add" || !formik.errors || !formik.submitCount) {
      return;
    }

    setCurrentTab(0);
  }, [formik.submitCount, formik.errors, props.action]);

  useEffect(() => {
    if (props.action !== "edit") {
      return;
    }

    formik.setValues({
      access_group: props.profile.access_group,
      all_computers: props.profile.all_computers,
      apt_sources: props.profile.apt_sources,
      description: props.profile.description,
      pockets: props.profile.pockets.map(({ id }) => id),
      tags: props.profile.tags,
      title: props.profile.title,
    });
  }, [props]);

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <RepositoryProfileFormTabs
        currentTab={currentTab}
        onCurrentTabChange={(tab) => {
          setCurrentTab(tab);
        }}
      />

      <AppErrorBoundary>
        {0 === currentTab && (
          <RepositoryProfileFormDetailsPanel
            accessGroups={accessGroupsResult?.data ?? []}
            isTitleRequired={props.action === "add"}
            isAccessGroupDisabled={props.action === "edit"}
            formik={formik}
          />
        )}

        {1 === currentTab && (
          <>
            {!getDistributionsResult?.data.length && (
              <p>No distributions found.</p>
            )}
            {getDistributionsResult &&
              getDistributionsResult.data.length > 0 && (
                <RepositoryProfileFormPocketsPanel
                  distributions={getDistributionsResult.data}
                  formik={formik}
                />
              )}
          </>
        )}

        {2 === currentTab && (
          <>
            {!getAPTSourcesResult?.data.length && <p>No APT sources found.</p>}
            {getAPTSourcesResult && getAPTSourcesResult.data.length > 0 && (
              <RepositoryProfileFormAptSourcesPanel
                aptSources={getAPTSourcesResult.data}
                formik={formik}
              />
            )}
          </>
        )}
      </AppErrorBoundary>

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText={CTA_INFO[props.action].label}
        submitButtonAriaLabel={CTA_INFO[props.action].ariaLabel}
      />
    </Form>
  );
};

export default RepositoryProfileForm;
