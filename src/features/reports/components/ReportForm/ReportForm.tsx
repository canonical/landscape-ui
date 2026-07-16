import type { FC } from "react";
import { useEffect, useRef } from "react";
import useReports from "@/hooks/useReports";
import { CheckboxInput, Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import classes from "./ReportForm.module.scss";
import { getFormikError } from "@/utils/formikErrors";
import { downloadBlob } from "@/utils/browserDownload";

const DEFAULT_RANGE_DAYS = 30;

interface ReportFormProps {
  readonly instanceIds: readonly number[];
}

const ReportForm: FC<ReportFormProps> = ({ instanceIds }) => {
  const { getCsvComplianceData } = useReports();

  // The submit handler triggers `refetch`, but the query hook that creates it
  // needs the form values and so must be set up after the form. A ref bridges
  // the two so the handler always calls the latest refetch — no forward
  // reference, and the query still reads the values chosen at submit time.
  const refetchRef = useRef<
    (() => Promise<{ data?: { data?: string } }>) | null
  >(null);

  const formik = useFormik({
    initialValues: { range: DEFAULT_RANGE_DAYS, reportByCve: true },
    validationSchema: Yup.object({
      range: Yup.number()
        .min(1, "Range must be at least 1 day")
        .required("This field is required"),
      reportByCve: Yup.boolean(),
    }),
    onSubmit: async () => {
      const result = await refetchRef.current?.();
      downloadBlob(
        new Blob([result?.data?.data ?? ""], {
          type: "text/csv;charset=utf-8;",
        }),
        "report.csv",
      );
    },
  });

  // Fetched on submit (not on mount) so the report reflects the chosen range
  // and CVE/USN grouping, and so we make the heavy compliance query only when
  // the user actually downloads.
  const { refetch, isFetching } = getCsvComplianceData(
    {
      query: `id:${instanceIds.join(" OR id:")}`,
      max_days: Number(formik.values.range),
      by_cve: formik.values.reportByCve,
    },
    { enabled: false },
  );

  // Keep the ref pointing at the latest refetch so the submit handler above
  // (defined before this hook) always calls the current one.
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <CheckboxInput
        label="Report by CVE"
        inline
        {...formik.getFieldProps("reportByCve")}
        checked={formik.values.reportByCve}
      />
      <div className={classes.rangeContainer}>
        <Input
          type="number"
          label="Range"
          className="u-no-margin--bottom"
          style={{ maxWidth: "min-content" }}
          {...formik.getFieldProps("range")}
          error={getFormikError(formik, "range")}
        />
        <span>Days</span>
      </div>

      <p className="p-text--small u-text--muted">
        The CSV reports each instance against the USNs or CVEs released within
        the selected range. USNs outstanding for longer than the range (such as
        the &ldquo;60+ days outstanding&rdquo; metric in the report) are not
        included.
      </p>

      <SidePanelFormButtons
        submitButtonDisabled={isFetching}
        submitButtonText="Download"
      />
    </Form>
  );
};

export default ReportForm;
