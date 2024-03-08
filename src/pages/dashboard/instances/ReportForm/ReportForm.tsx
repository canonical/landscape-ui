import { FC } from "react";
import useDebug from "@/hooks/useDebug";
import useReports from "@/hooks/useReports";
import { CheckboxInput, Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";

const downloadCSV = (csvString: string, filename: string) => {
  // Create blob from string
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

  // Create URL for blob
  const url = URL.createObjectURL(blob);

  // Create link element
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  // Append link to body
  document.body.appendChild(link);

  // Programmatically click the link to start download
  link.click();

  // Clean up by removing the link
  document.body.removeChild(link);
};

interface ReportFormProps {
  instanceIds: number[];
}

const ReportForm: FC<ReportFormProps> = ({ instanceIds }) => {
  const debug = useDebug();
  const { getCsvComplianceData } = useReports();

  const { data: getCsvComplianceDataResult, error: getCsvComplianceDataError } =
    getCsvComplianceData({
      query: `id:${instanceIds.join(" OR id:")}`,
    });

  if (getCsvComplianceDataError) {
    debug(getCsvComplianceDataError);
  }

  const formik = useFormik({
    initialValues: { range: 0, reportByCve: true },
    validationSchema: Yup.object({
      range: Yup.number().required("This field is required"),
      reportByCve: Yup.boolean(),
    }),
    // todo: figure out how to use form values to submit
    onSubmit: () =>
      downloadCSV(getCsvComplianceDataResult?.data || "", "report.csv"),
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <CheckboxInput
        label="Report by CVE"
        inline
        {...formik.getFieldProps("reportByCve")}
        checked={formik.values.reportByCve}
      />
      <div style={{ display: "flex", alignItems: "end", columnGap: "1rem" }}>
        <Input
          type="number"
          label="Range"
          className="u-no-margin--bottom"
          wrapperClassName=""
          style={{ maxWidth: "min-content" }}
          {...formik.getFieldProps("range")}
          error={
            formik.touched.range && formik.errors.range
              ? formik.errors.range
              : undefined
          }
        />
        <span>Days</span>
      </div>

      <SidePanelFormButtons disabled={false} submitButtonText="Download" />
    </Form>
  );
};

export default ReportForm;
