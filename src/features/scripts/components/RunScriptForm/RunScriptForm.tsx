import { useFormik } from "formik";
import moment from "moment/moment";
import { FC } from "react";
import { Form, Input, MultiSelectItem } from "@canonical/react-components";
import MultiSelectField from "@/components/form/MultiSelectField";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { ExecuteScriptParams, useScripts } from "../../hooks";
import { Script } from "../../types";
import DeliveryBlock from "../DeliveryBlock";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import { FormProps } from "./types";
import { canRunScripts } from "@/features/instances";

interface RunScriptFormProps {
  script: Script;
}

const RunScriptForm: FC<RunScriptFormProps> = ({ script }) => {
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

  const { data: getAllInstanceTagsQueryResult } = getAllInstanceTagsQuery();

  const tagOptions: MultiSelectItem[] =
    getAllInstanceTagsQueryResult?.data.results.map((tag) => ({
      label: tag,
      value: tag,
    })) ?? [];

  const { data: getInstancesQueryResult } = getInstancesQuery();

  const instanceOptions: MultiSelectItem[] =
    getInstancesQueryResult?.data.results
      .filter((instance) => {
        return canRunScripts(instance);
      })
      .map(({ title, id }) => ({
        label: title,
        value: id,
      })) ?? [];

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

      <DeliveryBlock formik={formik} />

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Run script"
      />
    </Form>
  );
};

export default RunScriptForm;
