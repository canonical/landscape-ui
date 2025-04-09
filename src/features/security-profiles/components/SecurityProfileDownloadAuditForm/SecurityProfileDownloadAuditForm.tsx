import RadioGroup from "@/components/form/RadioGroup";
import { Input } from "@canonical/react-components";
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
      <p>Customize the audit by selecting the scope and the timeframe.</p>

      <RadioGroup
        label="Audit timeframe"
        field="audit_timeframe"
        formik={formik}
        inputs={[
          {
            key: "specific-date",
            label: "Specific date",
            expansion: <Input type="datetime-local" />,
          },
          {
            key: "date-range",
            label: "Date range",
            expansion: (
              <div className={classes.dateRange}>
                <div className={classes.date}>
                  <Input type="date" />
                </div>
                <span className={classes.separator}>-</span>

                <div className={classes.date}>
                  <Input type="date" />
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
    </>
  );
};

export default SecurityProfileDownloadAuditForm;
