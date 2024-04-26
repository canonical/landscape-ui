import { useFormik } from "formik";
import moment from "moment";
import { ChangeEvent, FC } from "react";
import { Form, Input, MultiSelectItem } from "@canonical/react-components";
import MultiSelectField from "@/components/form/MultiSelectField";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { ExecuteScriptParams, useScripts } from "@/features/scripts/hooks";
import { Script } from "@/features/scripts/types";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import { FormProps } from "./types";
import classes from "./ScriptRunForm.module.scss";

interface ScriptRunFormProps {
  script: Script;
}

const ScriptRunForm: FC<ScriptRunFormProps> = ({ script }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { getAllInstanceTagsQuery, getInstancesQuery } = useInstances();
  const { executeScriptQuery } = useScripts();

  const { mutateAsync: executeScript } = executeScriptQuery;

  const handleSubmit = async (values: FormProps) => {
    const valuesToSubmit: ExecuteScriptParams = {
      query:
        values.queryType === "ids"
          ? `id:${values.instanceIds.join(" OR id:")}`
          : `tag:${values.tags.join(" OR tag:")}`,
      script_id: script.id,
      username: values.username,
    };

    if (!values.deliverImmediately) {
      valuesToSubmit.deliver_after = moment(values.deliver_after)
        .toISOString()
        .replace(/\.\d+(?=Z$)/, "");
    }

    try {
      await executeScript(valuesToSubmit);

      closeSidePanel();

      notify.success({
        message: `"${script.title}" script queued to execute successfully`,
        title: "Script execution queued",
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA,
  });

  const {
    data: getAllInstanceTagsQueryResult,
    error: getAllInstanceTagsQueryError,
  } = getAllInstanceTagsQuery();

  if (getAllInstanceTagsQueryError) {
    debug(getAllInstanceTagsQueryError);
  }

  const tagOptions: MultiSelectItem[] =
    getAllInstanceTagsQueryResult?.data.results.map((tag) => ({
      label: tag,
      value: tag,
    })) ?? [];

  const { data: getInstancesQueryResult, error: getInstancesQueryError } =
    getInstancesQuery();

  if (getInstancesQueryError) {
    debug(getInstancesQueryError);
  }

  const instanceOptions: MultiSelectItem[] =
    getInstancesQueryResult?.data.results.map(({ title, id }) => ({
      label: title,
      value: id,
    })) ?? [];

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
      <p className="u-no-margin--bottom">Select instances by:</p>
      <div className="p-form--inline is-required">
        <Input
          type="radio"
          label="Tags"
          {...formik.getFieldProps("queryType")}
          value="tags"
          checked={formik.values.queryType === "tags"}
        />

        <Input
          type="radio"
          label="Names"
          {...formik.getFieldProps("queryType")}
          value="ids"
          checked={formik.values.queryType === "ids"}
        />
      </div>

      {formik.values.queryType === "tags" && (
        <MultiSelectField
          variant="condensed"
          label="Tags"
          required
          {...formik.getFieldProps("tags")}
          items={tagOptions}
          selectedItems={tagOptions.filter(({ value }) =>
            formik.values.tags.includes(value as string),
          )}
          onItemsUpdate={(items) =>
            formik.setFieldValue(
              "tags",
              items.map(({ value }) => value),
            )
          }
          error={
            formik.touched.tags && typeof formik.errors.tags === "string"
              ? formik.errors.tags
              : undefined
          }
        />
      )}

      {formik.values.queryType === "ids" && (
        <MultiSelectField
          variant="condensed"
          label="Instances"
          required
          {...formik.getFieldProps("instanceIds")}
          items={instanceOptions}
          selectedItems={instanceOptions.filter(({ value }) =>
            formik.values.instanceIds.includes(value as number),
          )}
          onItemsUpdate={(items) =>
            formik.setFieldValue(
              "instanceIds",
              items.map(({ value }) => value),
            )
          }
          error={
            formik.touched.instanceIds &&
            typeof formik.errors.instanceIds === "string"
              ? formik.errors.instanceIds
              : undefined
          }
        />
      )}

      <Input
        type="text"
        label="Run as user"
        autoComplete="off"
        required
        {...formik.getFieldProps("username")}
        error={
          formik.touched.username && formik.errors.username
            ? formik.errors.username
            : undefined
        }
      />
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
          type="datetime-local"
          label="Deliver after"
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

export default ScriptRunForm;
