import AssociationBlock from "@/components/form/AssociationBlock";
import MultiSelectField from "@/components/form/MultiSelectField";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import { getFormikError } from "@/utils/formikErrors";
import {
  Form,
  Icon,
  Input,
  RadioInput,
  Select,
  Tooltip,
} from "@canonical/react-components";
import classNames from "classnames";
import { FormikProvider, useFormik } from "formik";
import type { FC } from "react";
import {
  useCreateRebootProfileQuery,
  useEditRebootProfileQuery,
} from "../../api";
import {
  CTA_LABELS,
  DAY_OPTIONS,
  EXPIRATION_TOOLTIP_MESSAGE,
  NOTIFICATION_ACTIONS,
} from "./constants";
import { getInitialValues, getValidationSchema } from "./helpers";
import classes from "./RebootProfilesForm.module.scss";
import type { FormProps, RebootProfilesFormProps } from "./types";

const RebootProfilesForm: FC<RebootProfilesFormProps> = (props) => {
  const { getAccessGroupQuery } = useRoles();
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { notify } = useNotify();

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();
  const { createRebootProfile, isCreatingRebootProfile } =
    useCreateRebootProfileQuery();
  const { editRebootProfile, isEditingRebootProfile } =
    useEditRebootProfileQuery();
  const accessGroupOptions =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const formik = useFormik<FormProps>({
    initialValues: getInitialValues(props, accessGroupOptions),
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (props.action === "edit") {
          await editRebootProfile({
            id: props.profile.id,
            access_group: values.access_group,
            at_hour: Number(values.at_hour),
            at_minute: Number(values.at_minute),
            deliver_delay_window: values.randomize_delivery
              ? Number(values.deliver_delay_window)
              : 0,
            deliver_within: Number(values.deliver_delay_window),
            on_days: values.on_days,
            title: values.title,
            tags: values.tags,
            every: "week",
            all_computers: values.all_computers,
          });
        } else {
          await createRebootProfile({
            title: values.title,
            tags: values.tags,
            access_group: values.access_group,
            on_days: values.on_days,
            every: "week",
            at_hour: Number(values.at_hour),
            at_minute: Number(values.at_minute),
            deliver_delay_window: values.randomize_delivery
              ? Number(values.deliver_delay_window)
              : 0,
            deliver_within: Number(values.deliver_delay_window),
            all_computers: values.all_computers,
          });
        }

        closeSidePanel();

        notify.success({
          message: `Reboot profile "${values.title}" has been ${NOTIFICATION_ACTIONS[props.action]} `,
          title: `Reboot profile ${NOTIFICATION_ACTIONS[props.action]}`,
        });
      } catch (error) {
        debug(error);
      }
    },
    validationSchema: getValidationSchema(props.action),
  });

  const timeErrors = [
    getFormikError(formik, "at_hour"),
    getFormikError(formik, "at_minute"),
    getFormikError(formik, "deliver_within"),
  ];

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={formik.handleSubmit} noValidate>
        <Input
          type="text"
          label="Name"
          required={props.action === "add"}
          {...formik.getFieldProps("title")}
          error={formik.touched.title && formik.errors.title}
        />

        <Select
          label="Access group"
          aria-label="Access group"
          options={accessGroupOptions}
          {...formik.getFieldProps("access_group")}
          error={getFormikError(formik, "access_group")}
        />

        <div className={classes.container}>
          <p className="p-heading--5">Schedule</p>

          <MultiSelectField
            variant="condensed"
            label="Days"
            items={DAY_OPTIONS}
            selectedItems={DAY_OPTIONS.filter(({ value }) =>
              formik.values.on_days.includes(value),
            )}
            onItemsUpdate={(items) =>
              formik.setFieldValue(
                "on_days",
                items.map(({ value }) => value),
              )
            }
            error={
              formik.touched.on_days &&
              typeof formik.errors.on_days === "string"
                ? formik.errors.on_days
                : undefined
            }
          />

          <div className={classes.timeContainer}>
            <div className={classes.time}>
              <>
                <Input
                  type="number"
                  label="Time"
                  aria-label="at hour"
                  placeholder="HH"
                  className={classes.timeInput}
                  wrapperClassName={classNames({ "is-error": timeErrors[0] })}
                  {...formik.getFieldProps("at_hour")}
                  aria-errormessage={timeErrors[0] ? "hour-error" : undefined}
                />

                <span className={classes.colon}>&#58;</span>
              </>

              <Input
                type="number"
                label="At minute"
                labelClassName="u-off-screen"
                aria-label="at minute"
                className={classes.timeInput}
                wrapperClassName={classNames({ "is-error": timeErrors[1] })}
                placeholder="MM"
                {...formik.getFieldProps("at_minute")}
                aria-errormessage={timeErrors[1] ? "minute-error" : undefined}
              />

              <Input
                type="number"
                label={
                  <>
                    <span>Expires after </span>
                    <Tooltip
                      message={EXPIRATION_TOOLTIP_MESSAGE}
                      position="top-right"
                      tooltipClassName={classes.tooltip}
                    >
                      <Icon name="help" />
                    </Tooltip>
                  </>
                }
                wrapperClassName={classNames(classes.expiration, {
                  "is-error": timeErrors[2],
                })}
                className={classes.timeInput}
                {...formik.getFieldProps("deliver_within")}
                aria-errormessage="expires-error"
              />

              <span className={classes.inputDescriptionAfter}>hours</span>
            </div>

            {timeErrors.filter(Boolean).length > 0 && (
              <div
                className={classNames({
                  "is-error": timeErrors.filter(Boolean).length > 0,
                })}
              >
                {timeErrors[0] && (
                  <p className="p-form-validation__message" id="hour-error">
                    <span>{timeErrors[0]}</span>
                  </p>
                )}
                {timeErrors[1] && (
                  <p className="p-form-validation__message" id="minute-error">
                    <span>{timeErrors[1]}</span>
                  </p>
                )}
                {timeErrors[2] && (
                  <p className="p-form-validation__message" id="expires-error">
                    <strong>Error: </strong>
                    <span>{timeErrors[2]}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          <p>Randomise delivery over a time window</p>

          <div className={classes.radioGroup}>
            <RadioInput
              label="No"
              {...formik.getFieldProps("randomize_delivery")}
              checked={!formik.values.randomize_delivery}
              onChange={async () => {
                await formik.setFieldValue("randomize_delivery", false);
                await formik.setFieldValue("deliver_delay_window", "");
              }}
            />
            <RadioInput
              label="Yes"
              {...formik.getFieldProps("randomize_delivery")}
              checked={formik.values.randomize_delivery}
              onChange={() => formik.setFieldValue("randomize_delivery", true)}
            />
          </div>

          {formik.values.randomize_delivery && (
            <div className={classes.windowInputContainer}>
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                label="Deliver delay window"
                labelClassName="u-off-screen"
                className={classes.windowInput}
                {...formik.getFieldProps("deliver_delay_window")}
                error={
                  formik.touched.deliver_delay_window &&
                  formik.errors.deliver_delay_window
                    ? formik.errors.deliver_delay_window
                    : undefined
                }
              />
              <span className={classes.windowInputDescription}>minutes</span>
            </div>
          )}
        </div>

        <AssociationBlock formik={formik} />

        <SidePanelFormButtons
          submitButtonText={CTA_LABELS[props.action]}
          submitButtonDisabled={
            formik.isSubmitting ||
            isCreatingRebootProfile ||
            isEditingRebootProfile
          }
        />
      </Form>
    </FormikProvider>
  );
};

export default RebootProfilesForm;
