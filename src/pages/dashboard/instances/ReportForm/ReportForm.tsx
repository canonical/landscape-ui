import type { FC } from "react";
import useReports from "@/hooks/useReports";
import { CheckboxInput, Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import classes from "./ReportForm.module.scss";
import { getFormikError } from "@/utils/formikErrors";
import { downloadBlob } from "@/utils/browserDownload";

interface ReportFormProps {
  readonly instanceIds: number[];
}

const ReportForm: FC<ReportFormProps> = ({ instanceIds }) => {
  const { getCsvComplianceData } = useReports();

  const { data: getCsvComplianceDataResult } = getCsvComplianceData({
    query: `id:${instanceIds.join(" OR id:")}`,
  });

  const formik = useFormik({
    initialValues: { range: 0, reportByCve: true },
    validationSchema: Yup.object({
      range: Yup.number().required("This field is required"),
      reportByCve: Yup.boolean(),
    }),
    // todo: figure out how to use form values to submit
    onSubmit: () => {
      downloadBlob(
        new Blob([getCsvComplianceDataResult?.data || ""], {
          type: "text/csv;charset=utf-8;",
        }),
        "report.csv",
      );
    },
  });

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

      <SidePanelFormButtons
        submitButtonDisabled={false}
        submitButtonText="Download"
      />
    </Form>
  );
};

export default ReportForm;
