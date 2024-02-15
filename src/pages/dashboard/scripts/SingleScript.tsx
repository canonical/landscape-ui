import { FC, useEffect, useMemo } from "react";
import { Script } from "../../../types/Script";
import useSidePanel from "../../../hooks/useSidePanel";
import useDebug from "../../../hooks/useDebug";
import useScripts, { CreateScriptParams } from "../../../hooks/useScripts";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Button, Form, Input, Select } from "@canonical/react-components";
import useAccessGroup from "../../../hooks/useAccessGroup";
import { SelectOption } from "../../../types/SelectOption";
import { Buffer } from "buffer";
import CodeEditor from "../../../components/form/CodeEditor";

interface FormProps extends CreateScriptParams {
  attachments: {
    first: File | null;
    second: File | null;
    third: File | null;
    fourth: File | null;
    fifth: File | null;
  };
  attachmentsToRemove: string[];
}

const INITIAL_VALUES: FormProps = {
  title: "",
  code: "",
  access_group: "",
  time_limit: 300,
  username: "",
  attachments: {
    first: null,
    second: null,
    third: null,
    fourth: null,
    fifth: null,
  },
  attachmentsToRemove: [],
};

type SingleScriptProps =
  | {
      action: "create";
    }
  | {
      action: "edit";
      script: Script;
    }
  | {
      action: "copy";
      script: Script;
    };

const SingleScript: FC<SingleScriptProps> = (props) => {
  const { closeSidePanel } = useSidePanel();
  const debug = useDebug();

  const { getAccessGroupQuery } = useAccessGroup();
  const {
    createScriptQuery,
    editScriptQuery,
    copyScriptQuery,
    getScriptCodeQuery,
    createScriptAttachmentQuery,
    removeScriptAttachmentQuery,
  } = useScripts();

  const { mutateAsync: createScript } = createScriptQuery;
  const { mutateAsync: editScript } = editScriptQuery;
  const { mutateAsync: copyScript } = copyScriptQuery;
  const { mutateAsync: createScriptAttachment } = createScriptAttachmentQuery;
  const { mutateAsync: removeScriptAttachment } = removeScriptAttachmentQuery;

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("This field is required"),
    time_limit: Yup.number().required("This field is required"),
    code: Yup.string().test({
      name: "required",
      message: "This field is required",
      test: (value) =>
        "copy" === props.action || "edit" === props.action || !!value,
    }),
    username: Yup.string(),
    access_group: Yup.string(),
    attachments: Yup.object().shape({
      first: Yup.mixed().nullable(),
      second: Yup.mixed().nullable(),
      third: Yup.mixed().nullable(),
      fourth: Yup.mixed().nullable(),
      fifth: Yup.mixed().nullable(),
    }),
    attachmentsToRemove: Yup.array().of(Yup.string()),
  });

  const createAttachments = async (
    script_id: number,
    attachments: (File | null)[],
  ) => {
    const promises: Promise<unknown>[] = [];

    const bufferPromises: Promise<ArrayBuffer>[] = [];
    const fileNames: string[] = [];

    for (const attachment of attachments) {
      if (!attachment) {
        continue;
      }

      bufferPromises.push(attachment.arrayBuffer());
      fileNames.push(attachment.name);
    }

    const buffers = await Promise.all(bufferPromises);

    for (let i = 0; i < buffers.length; i++) {
      promises.push(
        createScriptAttachment({
          script_id,
          file: `${fileNames[i]}$$${Buffer.from(buffers[i]).toString(
            "base64",
          )}`,
        }),
      );
    }

    await Promise.all(promises);
  };

  const handleSubmit = async (values: FormProps) => {
    try {
      if ("create" === props.action) {
        const newScript = await createScript({
          title: values.title,
          time_limit: values.time_limit,
          code: Buffer.from(values.code).toString("base64"),
          username: values.username,
          access_group: values.access_group,
        });

        await createAttachments(
          newScript.data.id,
          Object.values(values.attachments),
        );
      } else if ("edit" === props.action) {
        const promises: Promise<unknown>[] = [];
        const newAttachments = Object.values(values.attachments).filter(
          (attachment) => attachment,
        );

        for (const attachmentToRemove of values.attachmentsToRemove) {
          promises.push(
            removeScriptAttachment({
              script_id: props.script.id,
              filename: attachmentToRemove,
            }),
          );
        }

        if (promises.length) {
          await Promise.all([
            ...promises,
            editScript({
              script_id: props.script.id,
              title: values.title,
              time_limit: values.time_limit,
              code: Buffer.from(values.code).toString("base64"),
              username: values.username,
            }),
          ]);

          if (newAttachments.length) {
            await createAttachments(props.script.id, newAttachments);
          }
        } else if (newAttachments.length) {
          await Promise.all([
            editScript({
              script_id: props.script.id,
              title: values.title,
              time_limit: values.time_limit,
              code: Buffer.from(values.code).toString("base64"),
              username: values.username,
            }),
            createAttachments(
              props.script.id,
              Object.values(values.attachments),
            ),
          ]);
        } else {
          await editScript({
            script_id: props.script.id,
            title: values.title,
            time_limit: values.time_limit,
            code: Buffer.from(values.code).toString("base64"),
            username: values.username,
          });
        }
      } else if ("copy" === props.action) {
        await copyScript({
          script_id: props.script.id,
          destination_title: values.title,
          access_group: values.access_group,
        });
      }

      handleClose();
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleClose = () => {
    formik.resetForm();
    closeSidePanel();
  };

  useEffect(() => {
    if ("create" === props.action) {
      return;
    }

    if ("copy" === props.action) {
      formik.setFieldValue("access_group", props.script.access_group);
    } else if ("edit" === props.action) {
      formik.setFieldValue("title", props.script.title);
      formik.setFieldValue("time_limit", props.script.time_limit);
      formik.setFieldValue("username", props.script.username);
      formik.setFieldValue("access_group", props.script.access_group);
    }
  }, [props.action]);

  const {
    data: getScriptCodeResult,
    isFetching: getScriptCodeFetching,
    error: getScriptCodeError,
  } = getScriptCodeQuery(
    {
      script_id: "edit" === props.action ? props.script.id : 0,
    },
    {
      enabled: "edit" === props.action,
    },
  );

  if (getScriptCodeError) {
    debug(getScriptCodeError);
  }

  useEffect(() => {
    if (getScriptCodeFetching) {
      return;
    }

    formik.setFieldValue("code", getScriptCodeResult?.data ?? "");
  }, [getScriptCodeFetching]);

  const { data: getAccessGroupResult, error: getAccessGroupError } =
    getAccessGroupQuery();

  if (getAccessGroupError) {
    debug(getAccessGroupError);
  }

  const accessGroupsOptions = useMemo<SelectOption[]>(
    () =>
      (getAccessGroupResult?.data ?? []).map(({ name, title }) => ({
        label: title,
        value: name,
      })),
    [getAccessGroupResult],
  );

  const submitButtonText = useMemo(() => {
    if (props.action === "create") {
      return "Create";
    }

    if (props.action === "edit") {
      return "Save changes";
    }

    return "Copy";
  }, [props.action]);

  const FileInputs = [
    <Input
      key="first"
      type="file"
      label="First attachment"
      labelClassName="u-off-screen"
      onChange={(event) => {
        formik.setFieldValue(
          "attachments.first",
          event.target.files?.[0] ?? null,
        );
      }}
      error={
        formik.touched.attachments?.first && formik.errors.attachments?.first
      }
    />,
    <Input
      key="second"
      type="file"
      label="Second attachment"
      labelClassName="u-off-screen"
      onChange={(event) => {
        formik.setFieldValue(
          "attachments.second",
          event.target.files?.[0] ?? null,
        );
      }}
      error={
        formik.touched.attachments?.second && formik.errors.attachments?.second
      }
    />,
    <Input
      key="third"
      type="file"
      label="Third attachment"
      labelClassName="u-off-screen"
      onChange={(event) => {
        formik.setFieldValue(
          "attachments.third",
          event.target.files?.[0] ?? null,
        );
      }}
      error={
        formik.touched.attachments?.third && formik.errors.attachments?.third
      }
    />,
    <Input
      key="fourth"
      type="file"
      label="Fourth attachment"
      labelClassName="u-off-screen"
      onChange={(event) => {
        formik.setFieldValue(
          "attachments.fourth",
          event.target.files?.[0] ?? null,
        );
      }}
      error={
        formik.touched.attachments?.fourth && formik.errors.attachments?.fourth
      }
    />,
    <Input
      key="fifth"
      type="file"
      label="Fifth attachment"
      labelClassName="u-off-screen"
      onChange={(event) => {
        formik.setFieldValue(
          "attachments.fifth",
          event.target.files?.[0] ?? null,
        );
      }}
      error={
        formik.touched.attachments?.fifth && formik.errors.attachments?.fifth
      }
    />,
  ];

  const getAttachmentInputs = () => {
    const attachments = FileInputs;

    if ("edit" === props.action) {
      const scriptAttachments = props.script.attachments
        .filter(
          (attachment) =>
            !formik.values.attachmentsToRemove.includes(attachment),
        )
        .reverse();

      for (const scriptAttachment of scriptAttachments) {
        attachments.unshift(
          <div key={scriptAttachment}>
            <span>{scriptAttachment}</span>
            <Button
              hasIcon
              appearance="base"
              className="u-no-margin--bottom u-no-padding--left p-tooltip--top-center"
              aria-label={`Remove ${scriptAttachment} attachment`}
              onClick={() => {
                formik.setFieldValue("attachmentsToRemove", [
                  ...formik.values.attachmentsToRemove,
                  scriptAttachment,
                ]);
              }}
            >
              <span className="p-tooltip__message">Remove</span>
              <i className="p-icon--delete" />
            </Button>
          </div>,
        );
      }
    }

    return attachments.slice(0, 5);
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

      {("create" === props.action || "edit" === props.action) && (
        <>
          <Input
            type="number"
            label="Time limit (seconds)"
            required
            {...formik.getFieldProps("time_limit")}
            error={
              formik.touched.time_limit && formik.errors.time_limit
                ? formik.errors.time_limit
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
          />

          <Input
            type="text"
            label="Run as user"
            {...formik.getFieldProps("username")}
            error={
              formik.touched.username && formik.errors.username
                ? formik.errors.username
                : undefined
            }
          />
        </>
      )}

      <Select
        label="Access group"
        options={[
          { label: "Select access group", value: "" },
          ...accessGroupsOptions,
        ]}
        {...formik.getFieldProps("access_group")}
        error={
          formik.touched.access_group && formik.errors.access_group
            ? formik.errors.access_group
            : undefined
        }
      />

      {("create" === props.action || "edit" === props.action) && (
        <>
          <h5>List of attachments</h5>
          <p className="u-text--muted">
            Attachments that will be sent along with the script. You can attach
            up to 5 files, for a maximum of 1.00MB. Filenames must be unique. On
            the client, the attachments will be placed in the directory whose
            name is accessible through the environment variable
            LANDSCAPE_ATTACHMENTS. They&apos;ll be deleted once the script has
            been run.
          </p>
        </>
      )}

      {("create" === props.action || "edit" === props.action) &&
        getAttachmentInputs()}

      <div className="form-buttons">
        <Button
          type="submit"
          appearance="positive"
          disabled={formik.isSubmitting}
        >
          {submitButtonText}
        </Button>
        <Button type="button" onClick={handleClose}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default SingleScript;
