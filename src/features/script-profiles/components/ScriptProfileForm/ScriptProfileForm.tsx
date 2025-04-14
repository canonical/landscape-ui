import AssociationBlock from "@/components/form/AssociationBlock";
import { CronSchedule } from "@/components/form/CronSchedule";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import LoadingState from "@/components/layout/LoadingState";
import { useGetScripts } from "@/features/scripts";
import useRoles from "@/hooks/useRoles";
import { getFormikError } from "@/utils/formikErrors";
import {
  Col,
  CustomSelect,
  Input,
  Row,
  Select,
} from "@canonical/react-components";
import classNames from "classnames";
import { useFormik } from "formik";
import type { ComponentProps, FC } from "react";
import * as Yup from "yup";
import type { ScriptProfile } from "../../types";
import classes from "./ScriptProfileForm.module.scss";

interface ScriptProfileFormValues
  extends Pick<
      ScriptProfile,
      | "access_group"
      | "all_computers"
      | "title"
      | "tags"
      | "time_limit"
      | "username"
    >,
    Partial<Pick<ScriptProfile, "script_id">> {
  interval: string;
  start_after: string;
  timestamp: string;
  trigger_type: ScriptProfile["trigger"]["trigger_type"] | "";
}

interface ScriptProfileFormProps
  extends Pick<
    ComponentProps<typeof SidePanelFormButtons>,
    "submitButtonText"
  > {
  readonly initialValues: ScriptProfileFormValues;
  readonly disabledFields?: {
    access_group?: boolean;
    script_id?: boolean;
    trigger_type?: boolean;
  };
}

const ScriptProfileForm: FC<ScriptProfileFormProps> = ({
  initialValues,
  disabledFields = {},
  submitButtonText,
}) => {
  const { isScriptsLoading, scripts } = useGetScripts({
    listenToUrlParams: false,
  });
  const { getAccessGroupQuery } = useRoles();
  const {
    data: getAccessGroupQueryResponse,
    isLoading: isAccessGroupsLoading,
  } = getAccessGroupQuery();

  const formik = useFormik<ScriptProfileFormValues>({
    initialValues,

    validateOnMount: true,

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
        disabled={disabledFields.script_id}
        help={
          disabledFields.script_id &&
          "Scripts can't be replaced after the profile has been created."
        }
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
        disabled={disabledFields.access_group}
        help={
          disabledFields.access_group &&
          "Access group can't be edited after the profile has been created."
        }
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

      <CustomSelect
        label="Trigger"
        required
        onChange={async (value) => {
          await formik.setFieldValue("trigger_type", value);
        }}
        value={formik.values.trigger_type}
        disabled={disabledFields.trigger_type}
        options={[
          {
            label: (
              <>
                <p className="u-no-padding--top u-no-margin--bottom">
                  Post enrollment
                </p>

                <p
                  className={classNames(
                    classes.description,
                    "u-no-margin--bottom",
                  )}
                >
                  <small>Run the script after a new instance is enrolled</small>
                </p>
              </>
            ),
            value: "event",
            text: "Post enrollment",
          },
          {
            label: (
              <>
                <p className="u-no-padding--top u-no-margin--bottom">
                  On a date
                </p>

                <p
                  className={classNames(
                    classes.description,
                    "u-no-margin--bottom",
                  )}
                >
                  <small>Run the script on a selected date</small>
                </p>
              </>
            ),
            value: "one_time",
            text: "On a date",
          },
          {
            label: (
              <>
                <p className="u-no-padding--top u-no-margin--bottom">
                  Recurring
                </p>

                <p
                  className={classNames(
                    classes.description,
                    "u-no-margin--bottom",
                  )}
                >
                  <small>Run the script on a recurring schedule</small>
                </p>
              </>
            ),
            value: "recurring",
            text: "Recurring",
          },
        ]}
        help={
          disabledFields.trigger_type &&
          "Trigger type can't be changed after the script is created."
        }
      />

      {formik.values.trigger_type == "one_time" && (
        <Input
          type="datetime-local"
          label="Date"
          required
          {...formik.getFieldProps("timestamp")}
          error={getFormikError(formik, "timestamp")}
        />
      )}

      {formik.values.trigger_type == "recurring" && (
        <>
          <Input
            type="datetime-local"
            label="Start date"
            required
            {...formik.getFieldProps("start_after")}
            error={getFormikError(formik, "start_after")}
          />

          <CronSchedule required {...formik.getFieldProps("interval")} />
        </>
      )}

      <AssociationBlock formik={formik} />

      <SidePanelFormButtons
        submitButtonDisabled={!formik.isValid}
        submitButtonText={submitButtonText}
      />
    </>
  );
};

export default ScriptProfileForm;
