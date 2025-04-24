/* eslint-disable @typescript-eslint/no-unused-vars */
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { useGetScripts } from "@/features/scripts";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import type { SelectOption } from "@/types/SelectOption";
import { getFormikError } from "@/utils/formikErrors";
import { Col, Form, Input, Row, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import type { ChangeEvent, FC } from "react";
import { useMemo } from "react";
import {
  useCreateScript,
  useCreateScriptAttachment,
  useRemoveScript,
  useRunScript,
} from "../../api";
import type { RunInstanceScriptFormValues } from "../../types";
import DeliveryBlock from "../DeliveryBlock";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import { getNotification, getScriptOptions } from "./helpers";

interface RunInstanceScriptFormProps {
  readonly query: string;
}

const RunInstanceScriptForm: FC<RunInstanceScriptFormProps> = ({ query }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { getAccessGroupQuery } = useRoles();

  const { scripts } = useGetScripts(
    {
      listenToUrlParams: false,
    },
    {
      script_type: "v2",
    },
  );
  const { runScript } = useRunScript();

  const scriptOptions = getScriptOptions(scripts);

  const handleSubmit = async (values: RunInstanceScriptFormValues) => {
    try {
      await runScript({
        deliver_after: values.deliverImmediately
          ? undefined
          : values.deliver_after,
        query,
        script_id: values.script_id,
        username: values.username,
      });
      closeSidePanel();

      notify.success(getNotification(values, scriptOptions));
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: handleSubmit,
  });

  const handleScriptChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const scriptId = parseInt(event.target.value);

    await formik.setFieldValue("script_id", scriptId);

    if (!formik.values.username) {
      const userName =
        scripts.find(({ id }) => id === scriptId)?.username ?? "";

      await formik.setFieldValue("username", userName);
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

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Select
        label="Script"
        required
        options={scriptOptions}
        {...formik.getFieldProps("script_id")}
        onChange={handleScriptChange}
        error={getFormikError(formik, "script_id")}
      />
      <Select
        label="Access group"
        options={[
          { label: "Select access group", value: "" },
          ...accessGroupsOptions,
        ]}
        {...formik.getFieldProps("in_access_group")}
        error={getFormikError(formik, "in_access_group")}
      />
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

export default RunInstanceScriptForm;
