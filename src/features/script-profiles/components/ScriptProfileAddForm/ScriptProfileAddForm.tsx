import AssociationBlock from "@/components/form/AssociationBlock";
import LoadingState from "@/components/layout/LoadingState";
import { useGetScripts } from "@/features/scripts";
import useRoles from "@/hooks/useRoles";
import { getFormikError } from "@/utils/formikErrors";
import { Col, Input, Row, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import * as Yup from "yup";
import type { AddScriptProfileParams } from "../../api";

type ScriptProfileAddFormValues = Pick<
  AddScriptProfileParams,
  | "access_group"
  | "all_computers"
  | "title"
  | "tags"
  | "time_limit"
  | "username"
> &
  Partial<Pick<AddScriptProfileParams, "script_id">> &
  Partial<Pick<AddScriptProfileParams["trigger"], "trigger_type">>;

const ScriptProfileAddForm: FC = () => {
  const { isScriptsLoading, scripts } = useGetScripts({
    listenToUrlParams: false,
  });
  const { getAccessGroupQuery } = useRoles();
  const {
    data: getAccessGroupQueryResponse,
    isLoading: isAccessGroupsLoading,
  } = getAccessGroupQuery();

  const formik = useFormik<ScriptProfileAddFormValues>({
    initialValues: {
      access_group: "global",
      all_computers: false,
      tags: [],
      time_limit: 300,
      title: "",
      username: "Root",
    },

    validationSchema: Yup.object().shape({
      script_id: Yup.number().required("This field is required"),
      time_limit: Yup.number().required("This field is required"),
      title: Yup.string().required("This field is required"),
      trigger_type: Yup.string().required("This field is required"),
      username: Yup.string().required("This field is required"),
    }),

    onSubmit: () => undefined,
  });

  if (isScriptsLoading || isAccessGroupsLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <Input
        type="text"
        label="Name"
        required
        {...formik.getFieldProps("title")}
        error={getFormikError(formik, "title")}
      />

      <Select
        label="Script"
        required
        options={[
          { hidden: true },
          ...scripts.map((script) => ({
            label: script.title,
            value: script.id,
          })),
        ]}
        {...formik.getFieldProps("script_id")}
        error={getFormikError(formik, "script_id")}
      />

      <Select
        label="Access group"
        required
        options={getAccessGroupQueryResponse?.data.map((group) => ({
          label: group.title,
          value: group.name,
        }))}
        {...formik.getFieldProps("access_group")}
        error={getFormikError(formik, "access_group")}
      />

      <Row className="u-no-padding">
        <Col size={6}>
          <Input
            type="text"
            label="Run as user"
            required
            {...formik.getFieldProps("username")}
            error={getFormikError(formik, "username")}
          />
        </Col>

        <Col size={6}>
          <Input
            type="number"
            label="Time limit (seconds)"
            required
            {...formik.getFieldProps("time_limit")}
            error={getFormikError(formik, "time_limit")}
          />
        </Col>
      </Row>

      <Select label="Trigger" required />

      <AssociationBlock formik={formik} />
    </>
  );
};

export default ScriptProfileAddForm;
