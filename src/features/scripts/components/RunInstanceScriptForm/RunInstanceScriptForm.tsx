import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import type { Script } from "@/features/scripts";
import { ScriptDropdown } from "@/features/scripts";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { getFormikError } from "@/utils/formikErrors";
import { Col, Form, Input, Row } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useRunScript } from "../../api";
import DeliveryBlock from "../DeliveryBlock";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import type { FormProps } from "./types";

interface RunInstanceScriptFormProps {
  readonly query: string;
  readonly parentAccessGroup?: string;
}

const RunInstanceScriptForm: FC<RunInstanceScriptFormProps> = ({
  parentAccessGroup,
  query,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();

  const { runScript } = useRunScript();

  const handleSubmit = async (values: FormProps) => {
    try {
      await runScript({
        deliver_after: values.deliverImmediately
          ? undefined
          : values.deliver_after,
        query,
        script_id: values.script_id,
        time_limit: values.time_limit,
        username: values.username,
      });
      closeSidePanel();

      notify.success({
        message: `"${values.script?.title}" script queued to execute successfully`,
        title: "Script execution queued",
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: handleSubmit,
  });

  const handleScriptChange = async (script: Script | null) => {
    await formik.setFieldValue("script_id", script?.id ?? 0);

    if (!formik.values.username) {
      const userName = script?.username ?? "";

      await formik.setFieldValue("username", userName);
    }
  };

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <ScriptDropdown
        script={formik.values.script}
        setScript={async (script) => {
          await formik.setFieldValue("script", script);
          await handleScriptChange(script);
        }}
        errorMessage={getFormikError(formik, "script_id")}
        parentAccessGroup={parentAccessGroup}
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
