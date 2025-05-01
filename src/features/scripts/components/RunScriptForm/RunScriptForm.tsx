import MultiSelectField from "@/components/form/MultiSelectField";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { currentInstanceCan } from "@/features/instances";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { getFormikError } from "@/utils/formikErrors";
import type { MultiSelectItem } from "@canonical/react-components";
import { Col, Form, Input, Row } from "@canonical/react-components";
import { useFormik } from "formik";
import moment from "moment/moment";
import type { FC } from "react";
import { useRunScript } from "../../api";
import type { Script } from "../../types";
import DeliveryBlock from "../DeliveryBlock";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import classes from "./RunScriptForm.module.scss";
import type { FormProps } from "./types";

interface RunScriptFormProps {
  readonly script: Script;
}

const RunScriptForm: FC<RunScriptFormProps> = ({ script }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { getAllInstanceTagsQuery, getInstancesQuery } = useInstances();

  const { runScript } = useRunScript();

  const handleSubmit = async (values: FormProps) => {
    const valuesToSubmit = {
      query:
        values.queryType === "ids"
          ? `id:${values.instanceIds.join(" OR id:")}`
          : `tag:${values.tags.join(" OR tag:")}`,
      script_id: script.id,
      username: values.username,
      time_limit: Number(values.time_limit),
      deliver_after: values.deliverImmediately
        ? undefined
        : moment(values.deliver_after)
            .toISOString()
            .replace(/\.\d+(?=Z$)/, ""),
    };

    if (!values.deliverImmediately) {
      valuesToSubmit.deliver_after = moment(values.deliver_after)
        .toISOString()
        .replace(/\.\d+(?=Z$)/, "");
    }

    try {
      await runScript(valuesToSubmit);

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

  const { data: getInstancesQueryResult } = getInstancesQuery({
    query: `access-group-recursive:${script.access_group}`,
  });

  const instanceOptions: MultiSelectItem[] =
    getInstancesQueryResult?.data.results
      .filter((instance) => {
        return currentInstanceCan("runScripts", instance);
      })
      .map(({ title, id }) => ({
        label: title,
        value: id,
      })) ?? [];

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <p className="u-no-margin--bottom">Select instances by:</p>
      <div className="is-required">
        <div>
          <Input
            type="radio"
            label="Tags"
            {...formik.getFieldProps("queryType")}
            value="tags"
            checked={formik.values.queryType === "tags"}
          />

          <Input
            type="radio"
            label="Instance names"
            {...formik.getFieldProps("queryType")}
            value="ids"
            checked={formik.values.queryType === "ids"}
          />
          <div className={classes.instanceSelectionContainer}>
            {formik.values.queryType === "tags" && (
              <MultiSelectField
                placeholder="Select tags"
                variant="condensed"
                label="Tags"
                labelClassName="u-off-screen"
                required
                {...formik.getFieldProps("tags")}
                items={tagOptions}
                selectedItems={tagOptions.filter(({ value }) =>
                  formik.values.tags.includes(value as string),
                )}
                onItemsUpdate={async (items) =>
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
                placeholder="Select instances"
                variant="condensed"
                label="Instances"
                labelClassName="u-off-screen"
                required
                {...formik.getFieldProps("instanceIds")}
                items={instanceOptions}
                selectedItems={instanceOptions.filter(({ value }) =>
                  formik.values.instanceIds.includes(value as number),
                )}
                onItemsUpdate={async (items) =>
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
          </div>
        </div>
      </div>

      <Row className="u-no-padding--left u-no-padding--right">
        <Col size={6}>
          <Input
            type="text"
            label="Run as user"
            autoComplete="off"
            required
            {...formik.getFieldProps("username")}
            error={getFormikError(formik, "username")}
          />
        </Col>
        <Col size={6}>
          <Input
            type="text"
            label="Time limit (seconds)"
            autoComplete="off"
            required
            {...formik.getFieldProps("time_limit")}
            error={getFormikError(formik, "time_limit")}
          />
        </Col>
      </Row>
      <DeliveryBlock formik={formik} />

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Run script"
      />
    </Form>
  );
};

export default RunScriptForm;
