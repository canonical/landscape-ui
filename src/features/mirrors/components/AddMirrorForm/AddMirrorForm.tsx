import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import type { SelectOption } from "@/types/SelectOption";
import { getFormikError } from "@/utils/formikErrors";
import {
  CheckboxInput,
  Form,
  Input,
  Select,
  Textarea,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { ChangeEventHandler, FC } from "react";
import type { FormProps } from "./types";
import SidePanel from "@/components/layout/SidePanel/SidePanel";
import Blocks from "@/components/layout/Blocks";
import {
  useCreateMirror,
  useGetUbuntuArchiveInfo,
  useGetUbuntuEsmInfo,
} from "../../api";
import { getInitialValues } from "./helpers";
import MultiSelectField from "@/components/form/MultiSelectField/MultiSelectField";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";

const AddMirrorForm: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { createPageParamsSetter } = usePageParams();

  const {
    data: { data: ubuntuArchiveInfo },
  } = useGetUbuntuArchiveInfo();
  const {
    data: {
      data: { results: ubuntuEsmInfo },
    },
  } = useGetUbuntuEsmInfo();

  const { mutateAsync: createMirror } = useCreateMirror();

  const closeSidePanel = createPageParamsSetter({ sidePath: [] });

  const formik = useFormik<FormProps>({
    initialValues: getInitialValues({
      ubuntuArchiveDistributions: ubuntuArchiveInfo.distributions,
      ubuntuEsmInfo: ubuntuEsmInfo,
    }),
    onSubmit: async (values) => {
      try {
        const archiveRoot =
          values.sourceType === "ubuntu-snapshots"
            ? `https://snapshot.ubuntu.com/ubuntu/${values.snapshotDate}`
            : values.sourceUrl;

        await createMirror({
          archiveRoot,
          components: values.components,
          displayName: values.name,
          architectures: values.architectures,
          distribution: values.distribution,
          downloadInstaller: values.downloadInstallerFiles,
          downloadSources: values.downloadSources,
          downloadUdebs: values.downloadUdebPackages,
        });

        closeSidePanel();

        notify.success({
          title: `You have successfully added ${values.name}.`,
          message: "The mirror has been created.",
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  const proServiceOptions: SelectOption[] = ubuntuEsmInfo.map(
    ({ label, mirror_type }) => ({
      label,
      value: mirror_type,
    }),
  );

  const distributions =
    formik.values.sourceType === "ubuntu-archive" ||
    formik.values.sourceType === "ubuntu-snapshots"
      ? ubuntuArchiveInfo.distributions
      : formik.values.sourceType === "ubuntu-pro"
        ? ubuntuEsmInfo.find(
            ({ mirror_type }) => mirror_type === formik.values.proService,
          )!.distributions
        : [];

  const distributionOptions: SelectOption[] = distributions.map(
    ({ label, slug }) => ({
      label,
      value: slug,
    }),
  );

  const componentOptions: SelectOption[] =
    distributions
      .find(({ slug }) => slug === formik.values.distribution)
      ?.components.map((component) => ({
        label: component.slug,
        value: component.slug,
      })) ?? [];

  const architectureOptions: SelectOption[] =
    distributions
      .find(({ slug }) => slug === formik.values.distribution)
      ?.architectures.map((architecture) => ({
        label: architecture.slug,
        value: architecture.slug,
      })) ?? [];

  const handleChangeSourceType: ChangeEventHandler<HTMLSelectElement> = (
    event,
  ) => {
    const sourceType = event.target.value as FormProps["sourceType"];

    formik.setValues({
      ...getInitialValues({
        sourceType,
        ubuntuArchiveDistributions: ubuntuArchiveInfo.distributions,
        ubuntuEsmInfo: ubuntuEsmInfo,
      }),
      name: formik.values.name,
      downloadUdebPackages: formik.values.downloadUdebPackages,
      downloadInstallerFiles: formik.values.downloadInstallerFiles,
      downloadSources: formik.values.downloadSources,
    });
  };

  return (
    <>
      <SidePanel.Header>Add mirror</SidePanel.Header>
      <SidePanel.Content>
        <Form onSubmit={formik.handleSubmit} noValidate>
          <Blocks>
            <Blocks.Item title="Details">
              <Input
                type="text"
                label="Name"
                required
                {...formik.getFieldProps("name")}
                error={getFormikError(formik, "name")}
              />
              <Select
                label="Source type"
                required
                options={[
                  {
                    label: "Ubuntu archive",
                    value: "ubuntu-archive",
                    disabled: !ubuntuArchiveInfo.distributions.length,
                  },
                  {
                    label: "Ubuntu snapshots",
                    value: "ubuntu-snapshots",
                    disabled: !ubuntuArchiveInfo.distributions.length,
                  },
                  {
                    label: "Ubuntu Pro",
                    value: "ubuntu-pro",
                    disabled: !ubuntuEsmInfo.length,
                  },
                  { label: "Third party", value: "third-party" },
                ]}
                {...formik.getFieldProps("sourceType")}
                onChange={handleChangeSourceType}
                error={getFormikError(formik, "sourceType")}
              />
              {formik.values.sourceType === "ubuntu-pro" && (
                <Input
                  type="text"
                  label="Token"
                  required
                  {...formik.getFieldProps("token")}
                  error={getFormikError(formik, "token")}
                />
              )}
              <Input
                type="text"
                label="Source URL"
                required
                {...formik.getFieldProps("sourceUrl")}
                error={getFormikError(formik, "sourceUrl")}
                readOnly={formik.values.sourceType !== "third-party"}
              />
            </Blocks.Item>
            <Blocks.Item title="Mirror contents">
              {formik.values.sourceType === "ubuntu-snapshots" && (
                <Input
                  type="date"
                  label="Snapshot date"
                  required
                  {...formik.getFieldProps("snapshotDate")}
                  error={getFormikError(formik, "snapshotDate")}
                />
              )}
              {formik.values.sourceType === "ubuntu-pro" && (
                <Select
                  label="Pro service"
                  required
                  options={proServiceOptions}
                  {...formik.getFieldProps("proService")}
                  error={getFormikError(formik, "proService")}
                />
              )}
              <Select
                label="Distribution"
                required
                options={distributionOptions}
                {...formik.getFieldProps("distribution")}
                error={getFormikError(formik, "distribution")}
              />
              <MultiSelectField
                variant="condensed"
                hasSelectedItemsFirst={false}
                label="Components"
                {...formik.getFieldProps("components")}
                items={componentOptions}
                selectedItems={componentOptions.filter(({ value }) =>
                  formik.values.components?.includes(value),
                )}
                onItemsUpdate={async (items) =>
                  formik.setFieldValue(
                    "components",
                    items.map(({ value }) => value),
                  )
                }
              />
              <MultiSelectField
                variant="condensed"
                hasSelectedItemsFirst={false}
                label="Architectures"
                {...formik.getFieldProps("architectures")}
                items={architectureOptions}
                selectedItems={architectureOptions.filter(({ value }) =>
                  formik.values.architectures?.includes(value),
                )}
                onItemsUpdate={async (items) =>
                  formik.setFieldValue(
                    "architectures",
                    items.map(({ value }) => value),
                  )
                }
              />
              <p>Download options:</p>
              <CheckboxInput
                label="Download .udeb packages"
                {...formik.getFieldProps("downloadUdebPackages")}
                checked={formik.values.downloadUdebPackages}
              />
              <CheckboxInput
                label="Download sources"
                {...formik.getFieldProps("downloadSources")}
                checked={formik.values.downloadSources}
              />
              <CheckboxInput
                label="Download installer files"
                {...formik.getFieldProps("downloadInstallerFiles")}
                checked={formik.values.downloadInstallerFiles}
              />
            </Blocks.Item>
            {formik.values.sourceType === "third-party" && (
              <Blocks.Item title="Authentication">
                <Textarea
                  label="Verification GPG key"
                  {...formik.getFieldProps("verificationGpgKey")}
                  error={getFormikError(formik, "verificationGpgKey")}
                />
              </Blocks.Item>
            )}
          </Blocks>
          <SidePanelFormButtons
            submitButtonLoading={formik.isSubmitting}
            submitButtonText="Add mirror"
            onCancel={closeSidePanel}
          />
        </Form>
      </SidePanel.Content>
    </>
  );
};

export default AddMirrorForm;
