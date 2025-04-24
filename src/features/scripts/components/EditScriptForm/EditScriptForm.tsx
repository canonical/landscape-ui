import CodeEditor from "@/components/form/CodeEditor";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { getFormikError } from "@/utils/formikErrors";
import {
  Button,
  ConfirmationModal,
  Form,
  Icon,
  Input,
  ModularTable,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useRef, useState } from "react";
import { Link } from "react-router";
import type { CellProps } from "react-table";
import {
  useCreateScriptAttachment,
  useEditScript,
  useGetAssociatedScriptProfiles,
  useRemoveScriptAttachment,
} from "../../api";
import { DEFAULT_SCRIPT } from "../../constants";
import {
  getCreateAttachmentsPromises,
  getEditScriptParams,
} from "../../helpers";
import type {
  Script,
  ScriptFormValues,
  TruncatedScriptProfile,
} from "../../types";
import ScriptFormAttachments from "../ScriptFormAttachments";
import classes from "./EditScriptForm.module.scss";
import {
  getInitialValues,
  getValidationSchema,
  removeFileExtension,
} from "./helpers";

interface EditScriptFormProps {
  readonly script: Script;
}

const EditScriptForm: FC<EditScriptFormProps> = ({ script }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { closeSidePanel } = useSidePanel();
  const debug = useDebug();
  const { notify } = useNotify();

  const { createScriptAttachment } = useCreateScriptAttachment();
  const { removeScriptAttachment } = useRemoveScriptAttachment();
  const { editScript, isEditing } = useEditScript();

  const { associatedScriptProfiles, isAssociatedScriptProfilesLoading } =
    useGetAssociatedScriptProfiles(script.id, { enabled: modalOpen });

  const handleSubmit = async (values: ScriptFormValues) => {
    const newAttachments = Object.values(values.attachments).filter(
      (a) => a !== null,
    );
    try {
      const promises: Promise<unknown>[] = [
        editScript(getEditScriptParams({ scriptId: script.id, values })),
      ];
      if (values.attachmentsToRemove.length) {
        for (const filename of values.attachmentsToRemove) {
          promises.push(
            removeScriptAttachment({ script_id: script.id, filename }),
          );
        }
      }
      if (newAttachments.length) {
        promises.push(
          ...(await getCreateAttachmentsPromises({
            attachments: newAttachments,
            createScriptAttachment,
            script_id: script.id,
          })),
        );
      }
      await Promise.all(promises);
      closeSidePanel();
      setModalOpen(false);
      notify.success({
        title: `You have successfully submitted a new version of ${script.title}`,
        message:
          "All its associated profiles will now be run using this new version.",
      });
    } catch (error) {
      setModalOpen(false);
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: getInitialValues(script),
    validationSchema: getValidationSchema(),
    onSubmit: handleSubmit,
  });

  const handleInputChange = async ({
    target: { files },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (!files) return;
    const [file] = files;
    const contentsPromise = formik.setFieldValue("code", await file.text());
    if (formik.values.title) {
      await contentsPromise;
      return;
    }
    await Promise.all([
      formik.setFieldValue("title", removeFileExtension(file.name)),
      contentsPromise,
    ]);
  };

  const handleEditorChange = async (value?: string) => {
    await formik.setFieldValue("code", value);
  };

  const clickFileInput = () => inputRef.current?.click();

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

      <input
        ref={inputRef}
        className="u-hide"
        type="file"
        onChange={handleInputChange}
      />

      <CodeEditor
        label="Code"
        value={formik.values.code}
        onChange={handleEditorChange}
        error={getFormikError(formik, "code")}
        required
        defaultValue={DEFAULT_SCRIPT}
        headerContent={
          <Button
            className="u-no-margin--bottom"
            appearance="base"
            hasIcon
            onClick={clickFileInput}
            type="button"
          >
            <Icon name="upload" />
            <span>Populate from file</span>
          </Button>
        }
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
        getFileInputError={(key) =>
          getFormikError(formik, ["attachments", key])
        }
        initialAttachments={script.attachments}
        onFileInputChange={(key) => async (e) =>
          formik.setFieldValue(
            `attachments.${key}`,
            e.target.files?.[0] ?? null,
          )
        }
        onInitialAttachmentDelete={async (filename) =>
          formik.setFieldValue("attachmentsToRemove", [
            ...formik.values.attachmentsToRemove,
            filename,
          ])
        }
      />

      <SidePanelFormButtons
        onSubmit={() => {
          setModalOpen(true);
        }}
        submitButtonText="Submit new version"
      />

      {modalOpen && (
        <ConfirmationModal
          title={`Submit new version of "${script.title}"`}
          confirmButtonLabel="Submit new version"
          onConfirm={() => {
            formik.handleSubmit();
          }}
          confirmButtonAppearance="positive"
          confirmButtonDisabled={isEditing}
          confirmButtonLoading={isEditing}
          close={() => {
            setModalOpen(false);
          }}
          className={classes.modal}
        >
          <p>
            All future script runs will be done using the latest version of the
            code. Submitting these changes will affect the following profiles:
          </p>
          {associatedScriptProfiles.length > 0 && (
            <ModularTable
              columns={[
                {
                  Header: "active profiles",
                  accessor: "title",
                  Cell: ({ row }: CellProps<TruncatedScriptProfile>) => (
                    <Link
                      to="/scripts?tab=profiles"
                      state={{ scriptProfileId: row.original.id }}
                      target="_blank"
                      className={classes.link}
                    >
                      {row.original.title}
                    </Link>
                  ),
                },
                {
                  Header: "associated instances",
                  Cell: ({ row }: CellProps<TruncatedScriptProfile>) => {
                    const associatedProfile = associatedScriptProfiles.find(
                      (profile) => profile.id === row.original.id,
                    );

                    const associatedComputers =
                      associatedProfile?.computers.num_associated_computers;

                    if (isAssociatedScriptProfilesLoading) {
                      return <LoadingState />;
                    }

                    return associatedComputers ? (
                      <Link
                        to={`/instances?tags=${associatedProfile?.tags.join(",")}`}
                        target="_blank"
                        className={classes.link}
                      >
                        {associatedComputers} instances
                      </Link>
                    ) : (
                      <NoData />
                    );
                  },
                },
              ]}
              data={script.script_profiles}
            />
          )}
        </ConfirmationModal>
      )}
    </Form>
  );
};

export default EditScriptForm;
