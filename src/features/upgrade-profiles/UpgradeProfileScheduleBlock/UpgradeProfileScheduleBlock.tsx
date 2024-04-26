import classNames from "classnames";
import { FormikContextType } from "formik";
import { FC } from "react";
import { Icon, Input, RadioInput, Tooltip } from "@canonical/react-components";
import MultiSelectField from "@/components/form/MultiSelectField";
import { DAY_OPTIONS } from "@/features/upgrade-profiles/constants";
import { FormProps } from "@/features/upgrade-profiles/types";
import { EXPIRATION_TOOLTIP_MESSAGE } from "./constants";
import classes from "./UpgradeProfileScheduleBlock.module.scss";

interface UpgradeProfileScheduleBlockProps {
  formik: FormikContextType<FormProps>;
}

const UpgradeProfileScheduleBlock: FC<UpgradeProfileScheduleBlockProps> = ({
  formik,
}) => {
  const timeErrors = [
    (formik.touched.at_hour && formik.errors.at_hour) || undefined,
    (formik.touched.at_minute && formik.errors.at_minute) || undefined,
    (formik.touched.deliver_within && formik.errors.deliver_within) ||
      undefined,
  ];

  return (
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
          formik.touched.on_days && typeof formik.errors.on_days === "string"
            ? formik.errors.on_days
            : undefined
        }
      />

      <div className={classes.radioGroup}>
        <RadioInput
          label="At a specific time"
          {...formik.getFieldProps("every")}
          checked={formik.values.every === "week"}
          onChange={() => formik.setFieldValue("every", "week")}
        />
        <RadioInput
          label="Hourly"
          {...formik.getFieldProps("every")}
          checked={formik.values.every === "hour"}
          onChange={() => formik.setFieldValue("every", "hour")}
        />
      </div>

      <div className={classes.timeContainer}>
        <div className={classes.time}>
          {formik.values.every === "week" && (
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
          )}

          {formik.values.every === "hour" && (
            <span className={classes.inputDescriptionBefore}>at</span>
          )}

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

          {formik.values.every === "hour" && (
            <span className={classes.inputDescriptionAfter}>minute</span>
          )}

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
                <strong>Error: </strong>
                <span>{timeErrors[0]}</span>
              </p>
            )}
            {timeErrors[1] && (
              <p className="p-form-validation__message" id="minute-error">
                <strong>Error: </strong>
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
          {...formik.getFieldProps("randomizeDelivery")}
          checked={!formik.values.randomizeDelivery}
          onChange={async () => {
            await formik.setFieldValue("randomizeDelivery", false);
            await formik.setFieldValue("deliver_delay_window", "");
          }}
        />
        <RadioInput
          label="Yes"
          {...formik.getFieldProps("randomizeDelivery")}
          checked={formik.values.randomizeDelivery}
          onChange={() => formik.setFieldValue("randomizeDelivery", true)}
        />
      </div>

      {formik.values.randomizeDelivery && (
        <div className={classes.windowInputContainer}>
          <Input
            type="number"
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
  );
};

export default UpgradeProfileScheduleBlock;
