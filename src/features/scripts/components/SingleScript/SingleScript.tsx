import CodeEditor from "@/components/form/CodeEditor";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import type { ScriptProfile } from "@/features/script-profiles";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import { getFormikError } from "@/utils/formikErrors";
import {
  ConfirmationModal,
  Form,
  Input,
  ModularTable,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useEffect, useState } from "react";
import type { CellProps } from "react-table";
import { useGetAssociatedScriptProfiles } from "../../api";
import { DEFAULT_SCRIPT } from "../../constants";
import { useScripts } from "../../hooks";
import type { Script, ScriptFormValues } from "../../types";
import ScriptFormAttachments from "../ScriptFormAttachments";
import { CTA_LABELS, SCRIPT_FORM_INITIAL_VALUES } from "./constants";
import {
  getCreateAttachmentsPromises,
  getCreateScriptParams,
  getEditScriptParams,
  getValidationSchema,
} from "./helpers";
import classes from "./SingleScript.module.scss";
import useNotify from "@/hooks/useNotify";

type SingleScriptProps =
  | {
      action: "add";
    }
  | {
      action: "edit";
      script: Script;
    };

//TODO separate these in 2 different components, add and edit
const SingleScript: FC<SingleScriptProps> = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { closeSidePanel } = useSidePanel();
  const debug = useDebug();
  const { notify } = useNotify();

  const {
    createScriptQuery,
    editScriptQuery,
    getScriptCodeQuery,
    createScriptAttachmentQuery,
    removeScriptAttachmentQuery,
  } = useScripts();

  const { mutateAsync: createScript } = createScriptQuery;
  const { mutateAsync: editScript, isPending: isEditing } = editScriptQuery;
  const { mutateAsync: createScriptAttachment } = createScriptAttachmentQuery;
  const { mutateAsync: removeScriptAttachment } = removeScriptAttachmentQuery;

  const { associatedScriptProfiles } = useGetAssociatedScriptProfiles(
    props.action === "edit" ? props.script.id : 0,
    {
      enabled: props.action === "edit" && modalOpen,
    },
  );

  const handleSubmit = async (values: ScriptFormValues) => {
    const newAttachments = Object.values(values.attachments).filter(
      (attachment) => attachment !== null,
    );

    try {
      if ("add" === props.action) {
        const newScript = await createScript(getCreateScriptParams(values));

        if (newAttachments.length > 0) {
          await Promise.all(
            await getCreateAttachmentsPromises({
              attachments: newAttachments,
              createScriptAttachment,
              script_id: newScript.data.id,
            }),
          );
        }
      } else if ("edit" === props.action) {
        const promises: Promise<unknown>[] = [
          editScript(getEditScriptParams({ props, values })),
        ];

        if (values.attachmentsToRemove.length > 0) {
          for (const attachmentToRemove of values.attachmentsToRemove) {
            promises.push(
              removeScriptAttachment({
                script_id: props.script.id,
                filename: attachmentToRemove,
              }),
            );
          }

          await Promise.all(promises.splice(0));
        }

        if (newAttachments.length > 0) {
          promises.push(
            ...(await getCreateAttachmentsPromises({
              attachments: newAttachments,
              createScriptAttachment,
              script_id: props.script.id,
            })),
          );
        }

        await Promise.all(promises);
      }

      closeSidePanel();

      if (props.action === "edit") {
        setModalOpen(false);
        notify.success({
          title: `You have successfully submitted a new version of ${props.script.title}`,
          message:
            "All its associated profiles will now be run using this new version.",
        });
      }
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: SCRIPT_FORM_INITIAL_VALUES,
    validationSchema: getValidationSchema(props.action),
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if ("add" === props.action) {
      return;
    } else if ("edit" === props.action) {
      formik.setFieldValue("title", props.script.title);
      formik.setFieldValue("time_limit", props.script.time_limit);
      formik.setFieldValue("username", props.script.username);
      formik.setFieldValue("access_group", props.script.access_group);
    }
  }, [props.action]);

  const { data: getScriptCodeResult } = getScriptCodeQuery(
    { script_id: "edit" === props.action ? props.script.id : 0 },
    { enabled: "edit" === props.action },
  );

  useEffect(() => {
    if (!getScriptCodeResult) {
      return;
    }

    formik.setFieldValue("code", getScriptCodeResult.data);
  }, [getScriptCodeResult]);

  const handleOpenModal = () => {
    if (props.action === "edit") {
      setModalOpen(true);
    } else {
      formik.handleSubmit();
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        label="Title"
        required
        {...formik.getFieldProps("title")}
        error={
          formik.touched.title && formik.errors.title
            ? formik.errors.title
            : undefined
        }
      />

      <CodeEditor
        label="Code"
        required
        onChange={(value) => {
          formik.setFieldValue("code", value ?? "");
        }}
        value={formik.values.code}
        error={
          formik.touched.code && formik.errors.code
            ? formik.errors.code
            : undefined
        }
        defaultValue={DEFAULT_SCRIPT}
      />

      <>
        <h5>List of attachments</h5>
        <p className="u-text--muted">
          Attachments that will be sent along with the script. You can attach up
          to 5 files, for a maximum of 1.00MB. Filenames must be unique. On the
          client, the attachments will be placed in the directory whose name is
          accessible through the environment variable LANDSCAPE_ATTACHMENTS.
          They&apos;ll be deleted once the script has been run.
        </p>
      </>

      <ScriptFormAttachments
        attachments={formik.values.attachments}
        attachmentsToRemove={formik.values.attachmentsToRemove}
        getFileInputError={(key: keyof ScriptFormValues["attachments"]) =>
          getFormikError(formik, ["attachments", key])
        }
        initialAttachments={
          props.action === "edit" ? props.script.attachments : []
        }
        onFileInputChange={(key: keyof ScriptFormValues["attachments"]) =>
          (event) => {
            formik.setFieldValue(
              `attachments.${key}`,
              event.target.files?.[0] ?? null,
            );
          }}
        onInitialAttachmentDelete={(attachment: string) => {
          formik.setFieldValue("attachmentsToRemove", [
            ...formik.values.attachmentsToRemove,
            attachment,
          ]);
        }}
      />

      <SidePanelFormButtons
        onSubmit={handleOpenModal}
        submitButtonText={CTA_LABELS[props.action]}
      />

      {modalOpen && props.action === "edit" && (
        <ConfirmationModal
          title={`Submit new version of "${props.script.title}"`}
          confirmButtonLabel="Submit new version"
          onConfirm={() => {
            formik.handleSubmit();
          }}
          confirmButtonAppearance="positive"
          confirmButtonDisabled={isEditing}
          confirmButtonLoading={isEditing}
          close={handleCloseModal}
          className={classes.modal}
        >
          <p>
            All future script runs will be done using the latest version of the
            code. Submitting these changes will affect the following profiles:
          </p>
          {associatedScriptProfiles.length > 0 ? (
            <ModularTable
              columns={[
                {
                  Header: "active profiles",
                  accessor: "title",
                  Cell: ({ row }: CellProps<ScriptProfile>) => (
                    <>{row.original.title}</>
                  ),
                },
                {
                  Header: "associated instances",
                  accessor: "computers.num_associated_computers",
                  Cell: ({ row }: CellProps<ScriptProfile>) => (
                    <>
                      {row.original.computers.num_associated_computers}{" "}
                      instances
                    </>
                  ),
                },
              ]}
              data={associatedScriptProfiles}
            />
          ) : null}
        </ConfirmationModal>
      )}
    </Form>
  );
};

export default SingleScript;
