import { useFormik } from "formik";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { Button, Form, Icon, Link } from "@canonical/react-components";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import AssociationBlock from "@/components/form/AssociationBlock";
import RepositoryProfileFormDetailsPanel from "../RepositoryProfileFormDetailsPanel";
import RepositoryProfileFormSourcesSection from "../RepositoryProfileFormSourcesSection";
import RepositoryProfileSourceFormOverlay from "../RepositoryProfileSourceFormOverlay";
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
    }
  | {
      action: "edit";
      profile: RepositoryProfile;
      onClose?: () => void;
      hasBackButton?: boolean;
      onBackButtonPress?: () => void;
    };

const RepositoryProfileForm: FC<RepositoryProfileFormProps> = (props) => {
  const [showSourceOverlay, setShowSourceOverlay] = useState(false);
  const [sourceToEdit, setSourceToEdit] = useState<APTSource | null>(null);

  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel, setSidePanelTitle, setOnCloseOverride } =
    useSidePanel();

  const panelTitle =
    props.action === "add"
      ? "Add repository profile"
      : `Edit ${props.profile.title}`;

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
          apt_sources: values.apt_sources,
        });
        closeSidePanel();
        notify.success({
          title: "Repository profile created",
          message: `Repository profile "${values.title}" created successfully`,
        });
      } else {
        const originalSources = props.profile.apt_sources ?? [];
        await editRepositoryProfile({
          name: props.profile.name,
          ...valuesToSubmit,
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

  useEffect(() => {
    if (props.action !== "edit") {
      return;
    }

    formik.setValues({
      access_group: props.profile.access_group,
      all_computers: props.profile.all_computers,
      apt_sources: props.profile.apt_sources ?? [],
      description: props.profile.description,
      pockets: (props.profile.pockets ?? []).map(({ id }) => id),
      tags: props.profile.tags,
      title: props.profile.title,
    });
  }, [props]);

  const closeSourceOverlay = () => {
    setShowSourceOverlay(false);
    setSourceToEdit(null);
    setSidePanelTitle(panelTitle);
    setOnCloseOverride(undefined);
  };

  const handleAddSource = (source: APTSource) => {
    formik.setFieldValue("apt_sources", [
      ...formik.values.apt_sources,
      { ...source, id: 0 },
    ]);
    closeSourceOverlay();
  };

  const handleRemoveSource = (source: APTSource) => {
    formik.setFieldValue(
      "apt_sources",
      formik.values.apt_sources.filter((s) =>
        s.id !== 0 ? s.id !== source.id : s.name !== source.name,
      ),
    );
  };

  const handleEditSource = (source: APTSource) => {
    setSourceToEdit(source);
    setShowSourceOverlay(true);
    setOnCloseOverride(closeSourceOverlay);
    setSidePanelTitle(
      <>
        <Link className="u-no-margin--bottom" onClick={closeSourceOverlay}>
          {panelTitle}
        </Link>
        {" / Edit source"}
      </>,
    );
  };

  const handleSourceEdited = (updatedSource: APTSource) => {
    if (sourceToEdit?.id === 0) {
      notify.clear();
    }
    formik.setFieldValue(
      "apt_sources",
      formik.values.apt_sources.map((s) => {
        const matches =
          s.id !== 0
            ? s.id === sourceToEdit?.id
            : s.name === sourceToEdit?.name;
        return matches ? { ...updatedSource, id: 0 } : s;
      }),
    );
    closeSourceOverlay();
  };

  return (
    <div style={{ position: "relative" }}>
      <Form onSubmit={formik.handleSubmit} noValidate>
        <AppErrorBoundary>
          <Blocks dense>
            <Blocks.Item title="Details">
              <RepositoryProfileFormDetailsPanel
                accessGroups={accessGroupsResult?.data ?? []}
                isTitleRequired={props.action === "add"}
                isAccessGroupDisabled={props.action === "edit"}
                formik={formik}
              />
            </Blocks.Item>

            <Blocks.Item>
              <div className={classes.sourcesHeader}>
                <h4 className="p-heading--5 u-no-margin--bottom">Sources</h4>
                <Button
                  type="button"
                  hasIcon
                  dense
                  appearance="base"
                  onClick={() => {
                    setShowSourceOverlay(true);
                    setOnCloseOverride(closeSourceOverlay);
                    setSidePanelTitle(
                      <>
                        <Link
                          className="u-no-margin--bottom"
                          onClick={closeSourceOverlay}
                        >
                          {panelTitle}
                        </Link>
                        {" / Add source"}
                      </>,
                    );
                  }}
                >
                  <Icon name="plus" />
                  <span>Add source</span>
                </Button>
              </div>
              <RepositoryProfileFormSourcesSection
                sources={formik.values.apt_sources}
                onRemoveSource={handleRemoveSource}
                onEditSource={handleEditSource}
                error={getFormikError(formik, "apt_sources")}
              />
            </Blocks.Item>

            <Blocks.Item>
              <AssociationBlock formik={formik} />
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

      {showSourceOverlay && (
        <RepositoryProfileSourceFormOverlay
          onClose={closeSourceOverlay}
          onSourceAdded={sourceToEdit ? handleSourceEdited : handleAddSource}
          sourceToEdit={sourceToEdit}
        />
      )}
    </div>
  );
};

export default RepositoryProfileForm;
