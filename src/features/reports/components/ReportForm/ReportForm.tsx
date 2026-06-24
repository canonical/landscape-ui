import type { FC } from "react";
import useReports from "@/hooks/useReports";
import { CheckboxInput, Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import classes from "./ReportForm.module.scss";
import { getFormikError } from "@/utils/formikErrors";

const DEFAULT_RANGE_DAYS = 30;
import { downloadBlob } from "@/utils/browserDownload";

interface ReportFormProps {
  readonly instanceIds: readonly number[];
}

const ReportForm: FC<ReportFormProps> = ({ instanceIds }) => {
  const { getCsvComplianceData } = useReports();

  const formik = useFormik({
    initialValues: { range: DEFAULT_RANGE_DAYS, reportByCve: true },
    validationSchema: Yup.object({
      range: Yup.number()
        .min(1, "Range must be at least 1 day")
        .required("This field is required"),
      reportByCve: Yup.boolean(),
    }),
    onSubmit: async () => {
      // `refetch` is declared just below: the query must read the latest form
      // values, so the hook is set up after the form it depends on.
      // eslint-disable-next-line no-use-before-define
      const { data } = await refetch();
      downloadCSV(data?.data ?? "", "report.csv");
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
