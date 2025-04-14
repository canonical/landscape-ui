import RadioGroup from "@/components/form/RadioGroup";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { INPUT_DATE_FORMAT } from "@/constants";
import { useActivities } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import { getFormikError } from "@/utils/formikErrors";
import { Button, Input, Notification } from "@canonical/react-components";
import { useFormik } from "formik";
import moment from "moment";
import { useEffect, useRef, useState, type FC } from "react";
import * as Yup from "yup";
import { useGetSecurityProfileReport } from "../../api";
import classes from "./SecurityProfileDownloadAuditForm.module.scss";

interface SecurityProfileDownloadAuditFormValues {
  audit_timeframe: "specific-date" | "date-range";
  start_date: string;
  level_of_detail: "summary-only" | "detailed-view";
  end_date?: string;
}

interface SecurityProfileDownloadAuditFormProps {
  readonly profileId: number;
}

const SecurityProfileDownloadAuditForm: FC<
  SecurityProfileDownloadAuditFormProps
> = ({ profileId: id }) => {
  const debug = useDebug();

  const { getSingleActivityQuery } = useActivities();
  const { getSecurityProfileReport, isSecurityProfileReportLoading } =
    useGetSecurityProfileReport();

  const [isPendingReport, setIsPendingReport] = useState(false);
  const [reportURI, setReportURI] = useState<string | null>(null);

  const pendingReports = useRef<
    { activityId: number; securityProfileId: number }[]
  >(
    JSON.parse(
      localStorage.getItem("_landscape_pendingSecurityProfileReports") ?? "[]",
    ),
  );

  const pendingReport = useRef<
    | {
        activityId: number;
        securityProfileId: number;
      }
    | undefined
  >(pendingReports.current.find((report) => report.securityProfileId == id));

  const { data: getSingleActivityQueryResponse } = getSingleActivityQuery(
    {
      activityId: pendingReport.current?.activityId ?? 0,
    },
    { enabled: !!pendingReport.current },
  );

  useEffect(() => {
    if (!getSingleActivityQueryResponse) {
      return;
    }

    if (getSingleActivityQueryResponse.data.activity_status == "complete") {
      setReportURI(getSingleActivityQueryResponse.data.result_text);
    }
  }, [getSingleActivityQueryResponse]);

  const formik = useFormik<SecurityProfileDownloadAuditFormValues>({
    initialValues: {
      audit_timeframe: "specific-date",
      end_date: "",
      start_date: "",
      level_of_detail: "summary-only",
    },

    validationSchema: Yup.object().shape({
      end_date: Yup.string().when(
        ["audit_timeframe", "start_date"],
        ([audit_timeframe, start_date], schema) =>
          audit_timeframe == "date-range"
            ? schema
                .required("This field is required.")
                .test({
                  test: (end_date) =>
                    moment(end_date).isSameOrAfter(moment(start_date)),
                  message: "The end date must not be before the start date.",
                })
                .test({
                  test: (end_date) => moment(end_date).isSameOrBefore(moment()),
                  message: "The end date must not be in the future.",
                })
            : schema,
      ),

      start_date: Yup.string()
        .required("This field is required.")
        .test({
          test: (start_date) => moment(start_date).isSameOrBefore(moment()),
          message: "The date must not be in the future.",
        }),
    }),

    onSubmit: async (values) => {
      try {
        const response = (
          await getSecurityProfileReport({
            id,
            detailed: values.level_of_detail == "detailed-view" || undefined,
            end_date: values.end_date,
            start_date: values.start_date,
          })
        ).data;

        if (response.report_uri != undefined) {
          setReportURI(response.report_uri);
          return;
        }

        setIsPendingReport(true);

        if (
          pendingReports.current.some(
            (report) => report.activityId == response.activity_id,
          )
        ) {
          return;
        }

        pendingReports.current.push({
          activityId: response.activity_id,
          securityProfileId: id,
        });

        localStorage.setItem(
          "_landscape_pendingSecurityProfileReports",
          JSON.stringify(pendingReports),
        );
      } catch (error) {
        debug(error);
        return;
      }
    },
  });

  return (
    <>
      {isPendingReport && (
        <Notification inline title="Your audit is being generated:">
          Depending on the size and complexity of the audit, this may take up to
          5 minutes.
        </Notification>
      )}

      {reportURI && (
        <Notification inline title="Your requested audit is ready:">
          It has been successfully generated and is now available for download.{" "}
          <Button type="button" appearance="link" onClick={() => undefined}>
            Download audit
          </Button>
        </Notification>
      )}

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
                type="date"
                {...formik.getFieldProps("start_date")}
                error={getFormikError(formik, "start_date")}
                max={moment().format(INPUT_DATE_FORMAT)}
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
                    {...formik.getFieldProps("start_date")}
                    error={getFormikError(formik, "start_date")}
                    max={moment(formik.values.end_date).format(
                      INPUT_DATE_FORMAT,
                    )}
                  />
                </div>

                <span className={classes.separator}>-</span>

                <div className={classes.date}>
                  <Input
                    type="date"
                    {...formik.getFieldProps("end_date")}
                    error={getFormikError(formik, "end_date")}
                    max={moment().format(INPUT_DATE_FORMAT)}
                    min={moment(formik.values.start_date).format(
                      INPUT_DATE_FORMAT,
                    )}
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
        onSubmit={() => {
          formik.handleSubmit();
        }}
        submitButtonDisabled={
          !formik.isValid ||
          !formik.touched.start_date ||
          isSecurityProfileReportLoading
        }
        submitButtonLoading={isSecurityProfileReportLoading}
        submitButtonText="Generate CSV"
      />
    </>
  );
};

export default SecurityProfileDownloadAuditForm;
