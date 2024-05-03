import { ChangeEvent, FC, useMemo } from "react";
import useDebug from "@/hooks/useDebug";
import {
  CreateScriptParams,
  ExecuteScriptParams,
  useScripts,
} from "@/features/scripts";
import {
  CheckboxInput,
  Form,
  Input,
  Select,
} from "@canonical/react-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Buffer } from "buffer";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { SelectOption } from "@/types/SelectOption";
import useRoles from "@/hooks/useRoles";
import CodeEditor from "@/components/form/CodeEditor";
import classes from "./RunScriptForm.module.scss";
import moment from "moment";

interface FormProps
  extends CreateScriptParams,
    Omit<ExecuteScriptParams, "query"> {
  attachments: {
    first: File | null;
    second: File | null;
    third: File | null;
    fourth: File | null;
    fifth: File | null;
  };
  deliverImmediately: boolean;
  saveScript: boolean;
  type: "new" | "existing";
}

const INITIAL_VALUES: FormProps = {
  access_group: "",
  attachments: {
    first: null,
    second: null,
    third: null,
    fourth: null,
    fifth: null,
  },
  code: "",
  deliverImmediately: true,
  deliver_after: "",
  saveScript: true,
  script_id: 0,
  time_limit: 300,
  title: "",
  type: "new",
  username: "",
};

const VALIDATION_SCHEMA = Yup.object().shape({
  access_group: Yup.string().when("type", {
    is: "new",
    then: (schema) => schema.required(),
  }),
  attachments: Yup.object().shape({
    first: Yup.mixed().nullable(),
    second: Yup.mixed().nullable(),
    third: Yup.mixed().nullable(),
    fourth: Yup.mixed().nullable(),
    fifth: Yup.mixed().nullable(),
  }),
  code: Yup.string().when("type", {
    is: "new",
    then: (schema) => schema.required(),
  }),
  deliverImmediately: Yup.boolean().required(),
  deliver_after: Yup.string().when("deliverImmediately", {
    is: false,
    then: (schema) => schema.required(),
  }),
  saveScript: Yup.boolean().when("type", {
    is: "new",
    then: (schema) => schema.required(),
  }),
  script_id: Yup.number().when("type", {
    is: "existing",
    then: (schema) => schema.min(1, "Script is required"),
  }),
  time_limit: Yup.number().when("type", {
    is: "new",
    then: (schema) => schema.required(),
  }),
  title: Yup.string().when("type", {
    is: "new",
    then: (schema) => schema.required(),
  }),
  type: Yup.string<FormProps["type"]>().required(),
  username: Yup.string().required(),
});

interface RunScriptFormProps {
  query: string;
}

const RunScriptForm: FC<RunScriptFormProps> = ({ query }) => {
  const debug = useDebug();
  const { getAccessGroupQuery } = useRoles();
  const {
    createScriptAttachmentQuery,
    createScriptQuery,
    executeScriptQuery,
    getScriptsQuery,
    removeScriptQuery,
  } = useScripts();

  const { mutateAsync: createScriptAttachment } = createScriptAttachmentQuery;
  const { mutateAsync: createScript } = createScriptQuery;
  const { mutateAsync: executeScript } = executeScriptQuery;
  const { mutateAsync: removeScript } = removeScriptQuery;

  const handleSubmit = async (values: FormProps) => {
    if (values.type === "existing") {
      return executeScript({
        deliver_after: values.deliverImmediately
          ? values.deliver_after
          : undefined,
        query,
        script_id: values.script_id,
        username: values.username,
      });
    }

    const { data } = await createScript({
      title: values.title,
      time_limit: values.time_limit,
      code: Buffer.from(values.code).toString("base64"),
      access_group: values.access_group,
      username: values.username,
    });

    const attachments = Object.values(values.attachments).filter(
      Boolean,
    ) as File[];

    if (attachments.length > 0) {
      const buffers = await Promise.all(
        attachments.map((file) => file.arrayBuffer()),
      );

      const promises = attachments.map(({ name }, index) =>
        createScriptAttachment({
          script_id: data.id,
          file: `${name}$$${Buffer.from(buffers[index]).toString("base64")}`,
        }),
      );

      await Promise.all(promises);
    }

    await executeScript({
      deliver_after: values.deliverImmediately
        ? values.deliver_after
        : undefined,
      query,
      script_id: data.id,
      username: values.username,
    });

    if (!values.saveScript) {
      await removeScript({ script_id: data.id });
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      try {
        await handleSubmit(values);
      } catch (error) {
        debug(error);
      }
    },
  });

  const { data: getScriptsQueryResult } = getScriptsQuery();

  const scriptOptions = useMemo<SelectOption[]>(
    () =>
      (getScriptsQueryResult?.data.results ?? []).map(({ id, title }) => ({
        label: title,
        value: `${id}`,
      })),
    [getScriptsQueryResult],
  );

  const handleScriptChange = (event: ChangeEvent<HTMLSelectElement>) => {
    formik.setFieldValue("script_id", parseInt(event.target.value));

    if (!formik.values.username) {
      formik.setFieldValue(
        "username",
        getScriptsQueryResult?.data.results.find(
          ({ id }) => `${id}` === event.target.value,
        )?.username ?? "",
      );
    }
  };

  const { data: getAccessGroupResult } = getAccessGroupQuery();

  const accessGroupsOptions = useMemo<SelectOption[]>(
    () =>
      (getAccessGroupResult?.data ?? []).map(({ name, title }) => ({
        label: title,
        value: name,
      })),
    [getAccessGroupResult],
  );

  const handleDeliveryTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const deliverImmediately = event.currentTarget.value === "true";
    formik.setFieldValue("deliverImmediately", deliverImmediately);
    if (!deliverImmediately) {
      formik.setFieldValue(
        "deliver_after",
        moment().toISOString().slice(0, 16),
      );
    }
  };

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Select
        label="Type"
        labelClassName="u-off-screen"
        required
        options={[
          {
            label: "New script",
            value: "new",
          },
          {
            label: "Existing script",
            value: "existing",
          },
        ]}
        {...formik.getFieldProps("type")}
        error={
          formik.touched.type && formik.errors.type
            ? formik.errors.type
            : undefined
        }
      />

      {formik.values.type === "existing" && (
        <Select
          label="Script"
          required
          options={[
            {
              label: "Select script",
              value: 0,
            },
            ...scriptOptions,
          ]}
          {...formik.getFieldProps("script_id")}
          onChange={handleScriptChange}
          error={
            formik.touched.script_id && formik.errors.script_id
              ? formik.errors.script_id
              : undefined
          }
        />
      )}

      {formik.values.type === "new" && (
        <>
          <Input
            label="Title"
            type="text"
            required
            {...formik.getFieldProps("title")}
            error={
              formik.touched.title && formik.errors.title
                ? formik.errors.title
                : undefined
            }
          />

          <Input
            label="Time limit"
            type="number"
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

          <Select
            label="Access group"
            required
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
        </>
      )}

      <Input
        label="Run as user"
        type="text"
        required
        {...formik.getFieldProps("username")}
        error={
          formik.touched.username && formik.errors.username
            ? formik.errors.username
            : undefined
        }
      />

      {formik.values.type === "new" && (
        <>
          <CheckboxInput
            label="Save script"
            {...formik.getFieldProps("saveScript")}
            checked={formik.values.saveScript}
          />

          <h5>List of attachments</h5>
          <p className="u-text--muted">
            Attachments that will be sent along with the script. You can attach
            up to 5 files, for a maximum of 1.00MB. Filenames must be unique. On
            the client, the attachments will be placed in the directory whose
            name is accessible through the environment variable
            LANDSCAPE_ATTACHMENTS. They&apos;ll be deleted once the script has
            been run.
          </p>

          <Input
            label="First attachment"
            labelClassName="u-off-screen"
            type="file"
            onChange={(event) => {
              formik.setFieldValue(
                "attachments.first",
                event.target.files?.[0] ?? null,
              );
            }}
            error={
              formik.touched.attachments?.first &&
              formik.errors.attachments?.first
            }
          />

          <Input
            label="Second attachment"
            labelClassName="u-off-screen"
            type="file"
            onChange={(event) => {
              formik.setFieldValue(
                "attachments.second",
                event.target.files?.[0] ?? null,
              );
            }}
            error={
              formik.touched.attachments?.second &&
              formik.errors.attachments?.second
            }
          />

          <Input
            label="Third attachment"
            labelClassName="u-off-screen"
            type="file"
            onChange={(event) => {
              formik.setFieldValue(
                "attachments.third",
                event.target.files?.[0] ?? null,
              );
            }}
            error={
              formik.touched.attachments?.third &&
              formik.errors.attachments?.third
            }
          />

          <Input
            label="Fourth attachment"
            labelClassName="u-off-screen"
            type="file"
            onChange={(event) => {
              formik.setFieldValue(
                "attachments.fourth",
                event.target.files?.[0] ?? null,
              );
            }}
            error={
              formik.touched.attachments?.fourth &&
              formik.errors.attachments?.fourth
            }
          />

          <Input
            label="Fifth attachment"
            labelClassName="u-off-screen"
            type="file"
            onChange={(event) => {
              formik.setFieldValue(
                "attachments.fifth",
                event.target.files?.[0] ?? null,
              );
            }}
            error={
              formik.touched.attachments?.fifth &&
              formik.errors.attachments?.fifth
            }
          />
        </>
      )}

      <span className={classes.bold}>Delivery time</span>
      <div className={classes.radioGroup}>
        <Input
          type="radio"
          label="As soon as possible"
          name="deliverImmediately"
          value="true"
          onChange={handleDeliveryTimeChange}
          checked={formik.values.deliverImmediately}
        />
        <Input
          type="radio"
          label="Scheduled"
          name="deliverImmediately"
          value="false"
          onChange={handleDeliveryTimeChange}
          checked={!formik.values.deliverImmediately}
        />
      </div>
      {!formik.values.deliverImmediately && (
        <Input
          label="Deliver after"
          type="datetime-local"
          labelClassName="u-off-screen"
          {...formik.getFieldProps("deliver_after")}
          error={
            formik.touched.deliver_after && formik.errors.deliver_after
              ? formik.errors.deliver_after
              : undefined
          }
          help="Format MM-DD-YYYY HH:mm"
        />
      )}

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Run script"
      />
    </Form>
  );
};

export default RunScriptForm;
