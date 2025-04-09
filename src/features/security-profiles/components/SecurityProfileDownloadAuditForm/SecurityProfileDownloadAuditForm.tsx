import RadioGroup from "@/components/form/RadioGroup";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { getFormikError } from "@/utils/formikErrors";
import { Button, Input, Notification } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import classes from "./SecurityProfileDownloadAuditForm.module.scss";

interface FormikProps {
  audit_timeframe: "specific-date" | "date-range";
  date_end: string;
  date_start: string;
  level_of_detail: "summary-only" | "detailed-view";
  specific_date: string;
}

const SecurityProfileDownloadAuditForm: FC = () => {
  const formik = useFormik<FormikProps>({
    initialValues: {
      audit_timeframe: "specific-date",
      date_end: "",
      date_start: "",
      level_of_detail: "summary-only",
      specific_date: "",
    },
    onSubmit: () => undefined,
  });

  return (
    <>
      <Notification inline title="Your audit is being generated:">
        Depending on the size and complexity of the audit, this may take up to 5
        minutes.
      </Notification>

      <Notification inline title="Your requested audit is ready:">
        It has been successfully generated and is now available for download.{" "}
        <Button type="button" appearance="link" onClick={() => undefined}>
          Download audit
        </Button>
      </Notification>

      <p>Customize the audit by selecting the scope and the timeframe.</p>

      <RadioGroup
        label="Audit timeframe"
        field="audit_timeframe"
        formik={formik}
        inputs={[
          {
            key: "specific-date",
            label: "Specific date",
            expansion: (
              <Input
                type="datetime-local"
                {...formik.getFieldProps("specific_date")}
                error={getFormikError(formik, "specific_date")}
              />
            ),
          },
          {
            key: "date-range",
            label: "Date range",
            expansion: (
              <div className={classes.dateRange}>
                <div className={classes.date}>
                  <Input
                    type="date"
                    {...formik.getFieldProps("date_start")}
                    error={getFormikError(formik, "date_start")}
                  />
                </div>

                <span className={classes.separator}>-</span>

                <div className={classes.date}>
                  <Input
                    type="date"
                    {...formik.getFieldProps("date_end")}
                    error={getFormikError(formik, "date_end")}
                  />
                </div>
              </div>
            ),
          },
        ]}
      />

      <RadioGroup
        label="Level of detail"
        field="level_of_detail"
        formik={formik}
        inputs={[
          {
            key: "summary-only",
            label: "Summary only",
            help: "High-level overview of audit results",
          },
          {
            key: "detailed-view",
            label: "Detailed view",
            help: "Includes rules ID, severity, identifiers and references, description, rationale",
          },
        ]}
      />

      <SidePanelFormButtons
        submitButtonDisabled={false}
        submitButtonText="Download as CSV"
      />
    </>
  );
};

export default SecurityProfileDownloadAuditForm;
