import { useFormik } from "formik";
import { FC, useEffect, useState } from "react";
import { Form } from "@canonical/react-components";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import RepositoryProfileFormAptSourcesPanel from "@/features/repository-profiles/RepositoryProfileFormAptSourcesPanel";
import RepositoryProfileFormDetailsPanel from "@/features/repository-profiles/RepositoryProfileFormDetailsPanel";
import RepositoryProfileFormPocketsPanel from "@/features/repository-profiles/RepositoryProfileFormPocketsPanel";
import RepositoryProfileFormTabs from "@/features/repository-profiles/RepositoryProfileFormTabs";
import {
  CreateRepositoryProfileParams,
  useRepositoryProfiles,
} from "@/features/repository-profiles/hooks";
import {
  RepositoryProfile,
  RepositoryProfileFormValues,
} from "@/features/repository-profiles/types";
import useAPTSources from "@/hooks/useAPTSources";
import useDebug from "@/hooks/useDebug";
import useDistributions from "@/hooks/useDistributions";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import { CTA_INFO, INITIAL_VALUES } from "./constants";
import { getValidationSchema } from "./helpers";

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
  const { data: accessGroupsResult } = getAccessGroupQuery();

  const { mutateAsync: createRepositoryProfile } = createRepositoryProfileQuery;
  const { mutateAsync: editRepositoryProfile } = editRepositoryProfileQuery;

  const handleSubmit = async (values: RepositoryProfileFormValues) => {
    const valuesToSubmit: CreateRepositoryProfileParams = {
      access_group: values.access_group,
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
      props.action === "add"
        ? await createRepositoryProfile(valuesToSubmit)
        : await editRepositoryProfile({
            name: props.profile.name,
            ...valuesToSubmit,
          });

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
        onCurrentTabChange={(tab) => setCurrentTab(tab)}
      />

      {0 === currentTab && (
        <RepositoryProfileFormDetailsPanel
          accessGroups={accessGroupsResult?.data ?? []}
          isTitleRequired={props.action === "add"}
          formik={formik}
        />
      )}

      {1 === currentTab && (
        <>
          {!getDistributionsResult?.data.length && (
            <p>No distributions found.</p>
          )}
          {getDistributionsResult && getDistributionsResult.data.length > 0 && (
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

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText={CTA_INFO[props.action].label}
        submitButtonAriaLabel={CTA_INFO[props.action].ariaLabel}
      />
    </Form>
  );
};

export default RepositoryProfileForm;
