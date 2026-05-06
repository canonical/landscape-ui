import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import type { SelectOption } from "@/types/SelectOption";
import { getFormikError } from "@/utils/formikErrors";
import {
  CheckboxInput,
  Form,
  Icon,
  ICONS,
  Input,
  Select,
  Textarea,
  Tooltip,
} from "@canonical/react-components";
import { useFormik } from "formik";
import { type ComponentProps, type FC, useEffect, useRef } from "react";
import type { FormProps } from "./types";
import SidePanel from "@/components/layout/SidePanel/SidePanel";
import Blocks from "@/components/layout/Blocks";
import {
  useCreateMirror,
  useGetUbuntuArchiveInfo,
  useGetUbuntuEsmInfo,
} from "../../api";
import { getInitialValues } from "./helpers";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import SelectableMirrorContentsBlock from "../SelectableMirrorContentsBlock";
import { UBUNTU_SNAPSHOTS_HOST } from "../../constants";
import ReadOnlyField from "@/components/form/ReadOnlyField";
import { isArchiveInfoValid } from "../../helpers";
import * as Yup from "yup";

const AddMirrorForm: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = usePageParams();

  const ubuntuArchiveQuery = useGetUbuntuArchiveInfo();
  const ubuntuEsmQuery = useGetUbuntuEsmInfo();
  const createMirror = useCreateMirror().mutateAsync;

  const ubuntuArchiveInfo = ubuntuArchiveQuery.data?.data;
  const ubuntuEsmInfo = ubuntuEsmQuery.data?.data.results ?? [];
  // The form renders immediately so users can start filling in the type-agnostic
  // fields (Name, Source type) while we fetch the repository structure. The
  // Mirror contents block stays disabled with a loading note until both
  // archive and ESM info responses come back.
  const isMirrorContentsLoading =
    ubuntuArchiveQuery.isPending || ubuntuEsmQuery.isPending;

  const formik = useFormik<FormProps>({
    initialValues: getInitialValues({
      ubuntuArchiveInfo,
      ubuntuEsmInfo,
    }),

    validationSchema: Yup.object().shape({
      name: Yup.string().required("This field is required."),
      sourceType: Yup.string().required("This field is required."),
      sourceUrl: Yup.string()
        .required("This field is required.")
        .matches(/^https:\/\/.+/, "Source URL must use HTTPS."),
      distribution: Yup.string().required("This field is required."),
      components: Yup.array()
        .of(Yup.string())
        .min(1, "At least one component must be specified."),
      architectures: Yup.array()
        .of(Yup.string())
        .min(1, "At least one architecture must be specified."),
      token: Yup.string().when("sourceType", {
        is: "ubuntu-pro",
        then: (schema) => schema.required("This field is required."),
      }),
      snapshotDate: Yup.string().when("sourceType", {
        is: "ubuntu-snapshots",
        then: (schema) => schema.required("This field is required."),
      }),
      proService: Yup.string().when("sourceType", {
        is: "ubuntu-pro",
        then: (schema) => schema.required("This field is required."),
      }),
    }),

    validateOnBlur: true,

    onSubmit: async (values) => {
      try {
        const archiveRoot =
          values.sourceType === "ubuntu-snapshots"
            ? `https://${UBUNTU_SNAPSHOTS_HOST}/ubuntu/${values.snapshotDate}`
            : values.sourceUrl;

        await createMirror({
          archiveRoot,
          components: values.components.map((component) => component.trim()),
          displayName: values.name,
          architectures: values.architectures.map((architecture) =>
            architecture.trim(),
          ),
          distribution: values.distribution,
          downloadInstaller: values.downloadInstallerFiles,
          downloadSources: values.downloadSources,
          downloadUdebs: values.downloadUdebPackages,
          gpgKey: values.verificationGpgKey
            ? {
                armor: values.verificationGpgKey,
              }
            : undefined,
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

  const proServiceOptions: SelectOption[] = ubuntuEsmInfo.map((proService) => ({
    label: proService.label,
    value: proService.mirror_type,
    disabled: !isArchiveInfoValid(proService),
  }));

  // Once the archive/ESM info finishes loading, hydrate the data-dependent
  // fields (distribution, components, architectures, pro service) for the
  // user's currently selected source type while preserving anything they have
  // already typed (Name, Source type, download options, token).
  const hasHydratedRef = useRef(false);
  useEffect(() => {
    if (isMirrorContentsLoading || hasHydratedRef.current) {
      return;
    }
    hasHydratedRef.current = true;

    if (formik.values.sourceType === "third-party") {
      return;
    }

    void formik.setValues({
      ...getInitialValues({
        sourceType: formik.values.sourceType,
        ubuntuArchiveInfo,
        ubuntuEsmInfo,
      }),
      name: formik.values.name,
      downloadUdebPackages: formik.values.downloadUdebPackages,
      downloadInstallerFiles: formik.values.downloadInstallerFiles,
      downloadSources: formik.values.downloadSources,
      ...(formik.values.sourceType === "ubuntu-pro" && {
        token: formik.values.token,
      }),
      ...(formik.values.sourceType === "ubuntu-snapshots" &&
        formik.values.snapshotDate && {
          snapshotDate: formik.values.snapshotDate,
        }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMirrorContentsLoading]);

  return (
    <>
      <SidePanel.Header>Add mirror</SidePanel.Header>
      <SidePanel.Content>
        <Form onSubmit={formik.handleSubmit} noValidate>
          <Blocks>
            <Blocks.Item title="Details" titleClassName="p-text--small-caps">
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
                    disabled:
                      !!ubuntuArchiveInfo &&
                      !isArchiveInfoValid(ubuntuArchiveInfo),
                  },
                  {
                    label: "Ubuntu snapshots",
                    value: "ubuntu-snapshots",
                    disabled:
                      !!ubuntuArchiveInfo &&
                      !isArchiveInfoValid(ubuntuArchiveInfo),
                  },
                  {
                    label: "Ubuntu Pro",
                    value: "ubuntu-pro",
                    disabled:
                      !ubuntuEsmQuery.isPending &&
                      !ubuntuEsmInfo.some(isArchiveInfoValid),
                  },
                  { label: "Third party", value: "third-party" },
                ]}
                {...formik.getFieldProps("sourceType")}
                onChange={(event) => {
                  formik.setValues({
                    ...getInitialValues({
                      sourceType: event.target.value as FormProps["sourceType"],
                      ubuntuArchiveInfo,
                      ubuntuEsmInfo,
                    }),
                    name: formik.values.name,
                    downloadUdebPackages: formik.values.downloadUdebPackages,
                    downloadInstallerFiles:
                      formik.values.downloadInstallerFiles,
                    downloadSources: formik.values.downloadSources,
                  });
                }}
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
              {formik.values.sourceType === "third-party" ||
              formik.values.sourceType === "ubuntu-archive" ? (
                <Input
                  type="text"
                  label="Source URL"
                  required
                  help={
                    formik.values.sourceType === "ubuntu-archive"
                      ? "Use the default URL or point to a CDN mirror closer to your network. Must use HTTPS."
                      : undefined
                  }
                  {...formik.getFieldProps("sourceUrl")}
                  error={getFormikError(formik, "sourceUrl")}
                />
              ) : (
                <ReadOnlyField
                  label="Source URL"
                  value={formik.values.sourceUrl}
                  tooltipMessage="The source URL is set automatically by the source type."
                />
              )}
            </Blocks.Item>
            <Blocks.Item
              title="Mirror contents"
              titleClassName="p-text--small-caps"
              description={
                isMirrorContentsLoading &&
                formik.values.sourceType !== "third-party"
                  ? "Pulling and parsing repository data…"
                  : undefined
              }
            >
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
                  disabled={isMirrorContentsLoading}
                  error={getFormikError(formik, "proService")}
                />
              )}
              {formik.values.sourceType === "third-party" ? (
                <>
                  <Input
                    type="text"
                    label="Distribution"
                    required
                    {...formik.getFieldProps("distribution")}
                    error={getFormikError(formik, "distribution")}
                  />
                  <Input
                    type="text"
                    label="Components"
                    error={getFormikError(formik, "components")}
                    {...formik.getFieldProps("components")}
                    value={formik.values.components.join(", ")}
                    onChange={async (event) => {
                      await formik.setFieldValue(
                        "components",
                        event.target.value.split(", "),
                      );
                    }}
                    onBlur={async (event) => {
                      await formik.setFieldValue(
                        "components",
                        event.target.value.split(", ").filter(Boolean),
                      );
                    }}
                    required
                  />
                  <Input
                    type="text"
                    label="Architectures"
                    error={getFormikError(formik, "architectures")}
                    {...formik.getFieldProps("architectures")}
                    value={formik.values.architectures.join(", ")}
                    onChange={async (event) => {
                      await formik.setFieldValue(
                        "architectures",
                        event.target.value.split(", "),
                      );
                    }}
                    onBlur={async (event) => {
                      await formik.setFieldValue(
                        "architectures",
                        event.target.value.split(", ").filter(Boolean),
                      );
                    }}
                    required
                  />
                </>
              ) : (
                <SelectableMirrorContentsBlock
                  formik={
                    formik as ComponentProps<
                      typeof SelectableMirrorContentsBlock
                    >["formik"]
                  }
                  ubuntuArchiveInfo={ubuntuArchiveInfo}
                  ubuntuEsmInfo={ubuntuEsmInfo}
                  isLoading={isMirrorContentsLoading}
                />
              )}
              <p>Download options:</p>
              <CheckboxInput
                label="Download .udeb packages "
                {...formik.getFieldProps("downloadUdebPackages")}
                checked={formik.values.downloadUdebPackages}
                inline
              />
              <Tooltip
                position="right"
                message="Enables the mirroring of micro-debian (.udeb) packages. These are essential if you intend to use this mirror for network booting (PXE), netboot installations, or hardware discovery during the initial OS installation process."
              >
                <Icon name={ICONS.help} />
              </Tooltip>
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
