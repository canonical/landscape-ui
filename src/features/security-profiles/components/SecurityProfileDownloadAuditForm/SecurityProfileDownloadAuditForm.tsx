import RadioGroup from "@/components/form/RadioGroup";
import { useFormik } from "formik";
import type { FC } from "react";

const SecurityProfileDownloadAuditForm: FC = () => {
  const formik = useFormik<{
    level_of_detail: "summary-only" | "detailed-view";
    audit_timeframe: "specific-date" | "date-range";
  }>({
    initialValues: {
      level_of_detail: "summary-only",
      audit_timeframe: "specific-date",
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
          { key: "specific-date", label: "Specific date" },
          { key: "date-range", label: "Date range" },
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
