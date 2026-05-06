import { useFormik } from "formik";
import type { FC } from "react";
import { useEffect } from "react";
import { Button, Form, Icon } from "@canonical/react-components";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import AssociationBlock from "@/components/form/AssociationBlock";
import RepositoryProfileFormDetailsPanel from "../RepositoryProfileFormDetailsPanel";
import RepositoryProfileFormSourcesSection from "../RepositoryProfileFormSourcesSection";
import type { CreateRepositoryProfileParams } from "../../api";
import { useRepositoryProfiles } from "../../api";
import type {
  RepositoryProfile,
  RepositoryProfileFormValues,
} from "../../types";
import type { APTSource } from "../../types";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import { CTA_INFO, INITIAL_VALUES } from "./constants";
import { getValidationSchema } from "./helpers";
import { getFormikError } from "@/utils/formikErrors";
import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";
import Blocks from "@/components/layout/Blocks/Blocks";
import classes from "./RepositoryProfileForm.module.scss";

type RepositoryProfileFormProps =
  | {
      action: "add";
      aptSources: APTSource[];
      onAptSourcesChange: (sources: APTSource[]) => void;
      onAddSourceClick: () => void;
      onEditSourceClick: (source: APTSource) => void;
      onClose?: () => void;
    }
  | {
      action: "edit";
      profile: RepositoryProfile;
      aptSources: APTSource[];
      onAptSourcesChange: (sources: APTSource[]) => void;
      onAddSourceClick: () => void;
      onEditSourceClick: (source: APTSource) => void;
      onClose?: () => void;
      hasBackButton?: boolean;
      onBackButtonPress?: () => void;
    };

const RepositoryProfileForm: FC<RepositoryProfileFormProps> = (props) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();

  const { getAccessGroupQuery } = useRoles();
  const { createRepositoryProfileQuery, editRepositoryProfileQuery } =
    useRepositoryProfiles();

  const { data: accessGroupsResult } = getAccessGroupQuery(
    {},
    { enabled: props.action === "add" },
  );

  const { mutateAsync: createRepositoryProfile } = createRepositoryProfileQuery;
  const { mutateAsync: editRepositoryProfile } = editRepositoryProfileQuery;

  const handleSubmit = async (values: RepositoryProfileFormValues) => {
    const valuesToSubmit: CreateRepositoryProfileParams = {
      all_computers: values.all_computers,
      description: values.description,
      title: values.title,
    };

    try {
      if (props.action === "add") {
        if (!values.all_computers) {
          valuesToSubmit.tags = values.tags;
        }
        await createRepositoryProfile({
          access_group: values.access_group,
          ...valuesToSubmit,
          apt_sources: values.apt_sources,
        });
        (props.onClose ?? closeSidePanel)();
        notify.success({
          title: "Repository profile created",
          message: `Repository profile "${values.title}" created successfully`,
        });
      } else {
        const originalSources = props.profile.apt_sources ?? [];
        await editRepositoryProfile({
          name: props.profile.name,
          title: values.title,
          description: values.description,
          access_group: props.profile.access_group,
          tags: values.all_computers ? [] : (values.tags ?? []),
          all_computers: values.all_computers,
          add_apt_sources: values.apt_sources.filter((s) => s.id === 0),
          remove_apt_sources: originalSources
            .filter(
              (orig) => !values.apt_sources.some((cur) => cur.id === orig.id),
            )
            .map((s) => s.id),
        });
        (props.onClose ?? closeSidePanel)();
        notify.success({
          title: `You have successfully edited ${values.title}`,
          message: `The repository profile details have been updated.`,
        });
      }
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik<RepositoryProfileFormValues>({
    initialValues: INITIAL_VALUES,
    onSubmit: handleSubmit,
    validationSchema: getValidationSchema(props.action),
  });

  const profileName = props.action === "edit" ? props.profile.name : undefined;

  useEffect(() => {
    if (props.action !== "edit") {
      return;
    }

    formik.setValues({
      access_group: props.profile.access_group,
      all_computers: props.profile.all_computers,
      apt_sources: props.aptSources,
      description: props.profile.description || "",
      tags: props.profile.tags ?? [],
      title: props.profile.title,
    });
    // Only re-initialize when the profile identity changes, not on every aptSources update.
    // The separate effect below keeps apt_sources in sync with source list changes.
  }, [profileName]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    formik.setFieldValue("apt_sources", props.aptSources);
    // Including `formik` causes a rerender loop because Formik recreates it on updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.aptSources]);

  const handleRemoveSource = (source: APTSource) => {
    props.onAptSourcesChange(
      props.aptSources.filter((s) =>
        s.id !== 0 ? s.id !== source.id : s.name !== source.name,
      ),
    );
  };

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <AppErrorBoundary>
        <Blocks dense>
          <Blocks.Item title="Details" titleClassName="p-text--small-caps">
            <RepositoryProfileFormDetailsPanel
              accessGroups={accessGroupsResult?.data ?? []}
              isTitleRequired={props.action === "add"}
              isAccessGroupDisabled={props.action === "edit"}
              formik={formik}
            />
          </Blocks.Item>

          <Blocks.Item>
            <div className={classes.sourcesHeader}>
              <h4 className="p-heading--5 u-no-margin--bottom p-text--small-caps">
                Sources
              </h4>
              <Button
                type="button"
                hasIcon
                dense
                appearance="base"
                onClick={props.onAddSourceClick}
              >
                <Icon name="plus" />
                <span>Add source</span>
              </Button>
            </div>
            <RepositoryProfileFormSourcesSection
              sources={formik.values.apt_sources}
              onRemoveSource={handleRemoveSource}
              onEditSource={props.onEditSourceClick}
              error={getFormikError(formik, "apt_sources")}
            />
          </Blocks.Item>

          <Blocks.Item>
            <AssociationBlock formik={formik} titleClass="p-text--small-caps" />
          </Blocks.Item>
        </Blocks>
      </AppErrorBoundary>

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText={CTA_INFO[props.action].label}
        submitButtonAriaLabel={CTA_INFO[props.action].ariaLabel}
        onCancel={props.action === "edit" ? props.onClose : undefined}
        hasBackButton={
          props.action === "edit" ? props.hasBackButton : undefined
        }
        onBackButtonPress={
          props.action === "edit" ? props.onBackButtonPress : undefined
        }
      />
    </Form>
  );
};

export default RepositoryProfileForm;
