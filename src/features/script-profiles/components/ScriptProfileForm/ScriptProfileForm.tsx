import AssociationBlock from "@/components/form/AssociationBlock";
import { CronSchedule } from "@/components/form/CronSchedule";
import { toCronPhrase } from "@/components/form/CronSchedule/components/CronSchedule/helpers";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import LoadingState from "@/components/layout/LoadingState";
import { INPUT_DATE_TIME_FORMAT } from "@/constants";
import { useGetInstances } from "@/features/instances";
import { ScriptDropdown, type Script } from "@/features/scripts";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import { getFormikError } from "@/utils/formikErrors";
import {
  Col,
  CustomSelect,
  Form,
  Input,
  Notification,
  Row,
} from "@canonical/react-components";
import classNames from "classnames";
import { useFormik } from "formik";
import moment from "moment";
import { useEffect, useState, type ComponentProps, type FC } from "react";
import * as Yup from "yup";
import { useGetScriptProfileLimits } from "../../api";
import type { ScriptProfile } from "../../types";
import classes from "./ScriptProfileForm.module.scss";

export interface ScriptProfileFormValues
  extends Pick<
      ScriptProfile,
      "all_computers" | "title" | "tags" | "time_limit" | "username"
    >,
    Partial<Pick<ScriptProfile, "script_id">> {
  interval: string;
  start_after: string;
  timestamp: string;
  trigger_type: ScriptProfile["trigger"]["trigger_type"] | "";
  script?: Script | null;
}

export type ScriptProfileFormSubmitValues = Pick<
  ScriptProfile,
  | "all_computers"
  | "script_id"
  | "title"
  | "tags"
  | "time_limit"
  | "trigger"
  | "username"
>;

interface ScriptProfileFormProps
  extends Pick<
    ComponentProps<typeof SidePanelFormButtons>,
    "submitButtonText"
  > {
  readonly onSubmit: (
    values: ScriptProfileFormSubmitValues,
  ) => Promise<unknown>;
  readonly onSuccess: (values: ScriptProfileFormValues) => void;
  readonly initialValues: ScriptProfileFormValues;
  readonly disabledFields?: {
    script_id?: boolean;
    trigger_type?: boolean;
  };
  readonly submitting?: boolean;
}

const ScriptProfileForm: FC<ScriptProfileFormProps> = ({
  onSubmit,
  onSuccess,
  initialValues,
  disabledFields = {},
  submitButtonText,
  submitting = false,
}) => {
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { scriptProfileLimits, isGettingScriptProfileLimits } =
    useGetScriptProfileLimits();

  const formik = useFormik<ScriptProfileFormValues>({
    initialValues,

    validationSchema: Yup.object().shape({
      interval: Yup.string().when("trigger_type", ([trigger_type], schema) =>
        trigger_type == "recurring"
          ? schema.required("This field is required").test({
              test: (value) => {
                try {
                  toCronPhrase(value);
                  return true;
                } catch {
                  return false;
                }
              },
            })
          : schema,
      ),
      script: Yup.object().when("script_id", ([script_id], schema) =>
        script_id == undefined
          ? schema.required("This field is required")
          : schema,
      ),
      start_after: Yup.string().when(
        "trigger_type",
        ([trigger_type], schema) =>
          trigger_type == "recurring"
            ? schema.required("This field is required")
            : schema,
      ),
      time_limit: Yup.number().required("This field is required"),
      timestamp: Yup.string().when("trigger_type", ([trigger_type], schema) =>
        trigger_type == "one_time"
          ? schema.required("This field is required")
          : schema,
      ),
      title: Yup.string().required("This field is required"),
      trigger_type: Yup.string().required("This field is required"),
      username: Yup.string().required("This field is required"),
    }),

    onSubmit: async (values) => {
      if (!values.trigger_type || values.script_id == undefined) {
        return;
      }

      try {
        switch (values.trigger_type) {
          case "event": {
            await onSubmit({
              ...values,
              script_id: values.script_id,
              trigger: {
                trigger_type: "event",
                event_type: "post_enrollment",
              },
            });

            break;
          }

          case "one_time": {
            if (!values.timestamp) {
              return;
            }

            await onSubmit({
              ...values,
              script_id: values.script_id,
              trigger: {
                trigger_type: "one_time",
                timestamp: values.timestamp,
                last_run: "",
                next_run: "",
              },
            });

            break;
          }

          case "recurring": {
            if (!values.interval || !values.start_after) {
              return;
            }

            await onSubmit({
              ...values,
              script_id: values.script_id,
              trigger: {
                trigger_type: "recurring",
                interval: values.interval,
                start_after: values.start_after,
                last_run: "",
                next_run: "",
              },
            });

            break;
          }
        }
      } catch (error) {
        debug(error);
        return;
      }

      closeSidePanel();

      onSuccess(values);
    },
  });

  const { instancesCount, isGettingInstances } = useGetInstances({
    query: formik.values.all_computers
      ? undefined
      : formik.values.tags.map((tag) => `tag:${tag}`).join(" OR "),
    limit: 1,
  });

  const [isAssociationLimitReached, setIsAssociationLimitReached] =
    useState(false);

  useEffect(() => {
    if (instancesCount === undefined || !scriptProfileLimits) {
      return;
    }

    if (!formik.values.tags.length && !formik.values.all_computers) {
      setIsAssociationLimitReached(false);
      return;
    }

    setIsAssociationLimitReached(
      instancesCount >= scriptProfileLimits.max_num_computers,
    );
  }, [instancesCount]);

  if (isGettingScriptProfileLimits) {
    return <LoadingState />;
  }

  if (!scriptProfileLimits) {
    return;
  }

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Input
        type="text"
        label="Title"
        required
        {...formik.getFieldProps("title")}
        error={getFormikError(formik, "title")}
      />

      <ScriptDropdown
        script={formik.values.script}
        existingScriptId={formik.initialValues.script_id}
        setScript={async (script) => {
          await formik.setFieldValue("script", script);
          await formik.setFieldValue("script_id", script?.id);
        }}
        errorMessage={getFormikError(formik, "script")}
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
        error={getFormikError(formik, "trigger_type")}
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

      <div className={classes.indent}>
        {formik.values.trigger_type == "one_time" && (
          <Input
            type="datetime-local"
            label="Date"
            required
            min={moment().utc(true).format(INPUT_DATE_TIME_FORMAT)}
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
              min={moment().utc(true).format(INPUT_DATE_TIME_FORMAT)}
              {...formik.getFieldProps("start_after")}
              error={getFormikError(formik, "start_after")}
            />

            <Notification severity="caution" className={classes.notification}>
              There is a minimum interval of{" "}
              <strong>{scriptProfileLimits?.min_interval} minutes</strong>{" "}
              between runs. Depending on the schedule, run times may be
              adjusted.
            </Notification>

            <CronSchedule
              required
              touched={formik.touched.interval}
              {...formik.getFieldProps("interval")}
            />
          </>
        )}
      </div>

      {isAssociationLimitReached && (
        <Notification
          severity="negative"
          inline
          title="Associated instances limit reached:"
        >
          You&apos;ve reached the limit of{" "}
          <strong>
            {scriptProfileLimits.max_num_computers} associated instances
          </strong>
          . Decrease the number of associated instances.
        </Notification>
      )}

      <AssociationBlock formik={formik} />

      <SidePanelFormButtons
        submitButtonDisabled={
          submitting || isAssociationLimitReached || isGettingInstances
        }
        submitButtonLoading={submitting}
        submitButtonText={submitButtonText}
      />
    </Form>
  );
};

export default ScriptProfileForm;
