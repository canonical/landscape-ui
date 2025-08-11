import RadioGroup from "@/components/form/RadioGroup";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import LoadingState from "@/components/layout/LoadingState";
import { INPUT_DATE_FORMAT } from "@/constants";
import { useActivities } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import { Button, Input, Notification } from "@canonical/react-components";
import { useFormik } from "formik";
import moment from "moment";
import { useEffect, useState, type FC } from "react";
import * as Yup from "yup";
import { useGetSecurityProfileReport } from "../../api";
import { useSecurityProfileDownloadAudit } from "../../hooks/useSecurityProfileDownloadAudit";
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

type Status =
  | { type: "okay" }
  | { type: "pending" }
  | { type: "ready"; report_uri: string }
  | { type: "error" };

const SecurityProfileDownloadAuditForm: FC<
  SecurityProfileDownloadAuditFormProps
> = ({ profileId: id }) => {
  const debug = useDebug();
  const { setPageParams } = usePageParams();

  const { getSingleActivityQuery } = useActivities();
  const { getSecurityProfileReport, isSecurityProfileReportLoading } =
    useGetSecurityProfileReport();

  const downloadAudit = useSecurityProfileDownloadAudit();

  const [status, setStatus] = useState<Status>({ type: "okay" });

  const pendingReports = JSON.parse(
    localStorage.getItem("_landscape_pendingSecurityProfileReports") ?? "[]",
  ) as { activityId: number; profileId: number }[];

  const pendingReport = pendingReports.find((report) => report.profileId == id);

  const {
    data: getSingleActivityQueryResponse,
    isLoading: isGettingActivity,
    isError: isActivityError,
  } = getSingleActivityQuery(
    {
      activityId: pendingReport?.activityId ?? 0,
    },
    {
      enabled: !!pendingReport && status.type == "pending",
      refetchInterval: 1000,
    },
  );

  if (isActivityError && status.type != "error") {
    setStatus({
      type: "error",
    });
  }

  useEffect(() => {
    if (!getSingleActivityQueryResponse) {
      return;
    }

    if (getSingleActivityQueryResponse.data.activity_status == "succeeded") {
      setStatus({
        type: "ready",
        report_uri: getSingleActivityQueryResponse.data.result_text as string,
      });
    } else {
      setStatus({ type: "pending" });
    }
  }, [getSingleActivityQueryResponse]);

  const formik = useFormik<SecurityProfileDownloadAuditFormValues>({
    initialValues: {
      audit_timeframe: "specific-date",
      end_date: moment().format(INPUT_DATE_FORMAT),
      start_date: moment().format(INPUT_DATE_FORMAT),
      level_of_detail: "summary-only",
    },

    validateOnMount: true,

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
                  test: (end_date) =>
                    moment(end_date).utc(true).isSameOrBefore(moment()),
                  message: "The end date must not be in the future.",
                })
            : schema,
      ),

      start_date: Yup.string()
        .required("This field is required.")
        .test({
          test: (start_date) =>
            moment(start_date).utc(true).isSameOrBefore(moment()),
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

        if (response.activity_status == "succeeded") {
          setStatus({
            type: "ready",
            report_uri: response.result_text as string,
          });

          return;
        }

        setStatus({ type: "pending" });

        if (pendingReport) {
          pendingReport.activityId = response.id;
        } else {
          pendingReports.push({
            activityId: response.id,
            profileId: id,
          });
        }

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

  if (isGettingActivity) {
    return <LoadingState />;
  }

  return (
    <>
      {status.type == "pending" && (
        <Notification inline title="Your audit is being generated:">
          Depending on the size and complexity of the audit, this may take up to
          5 minutes.
        </Notification>
      )}

      {status.type == "ready" && (
        <Notification
          inline
          title="Your requested audit is ready:"
          onDismiss={() => {
            const index = pendingReports.findIndex(
              (report) => report.profileId == id,
            );

            setStatus({ type: "okay" });

            if (index == -1) {
              return;
            }

            pendingReports.splice(index, 1);

            if (pendingReports.length) {
              localStorage.setItem(
                "_landscape_pendingSecurityProfileReports",
                JSON.stringify(pendingReports),
              );
            } else {
              localStorage.removeItem(
                "_landscape_pendingSecurityProfileReports",
              );
            }
          }}
        >
          It has been successfully generated and is now available for download.{" "}
          <Button
            appearance="link"
            type="button"
            className="u-no-margin--bottom u-no-padding--top"
            onClick={() => {
              downloadAudit(status.report_uri);
            }}
          >
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
                max={moment().utc().format(INPUT_DATE_FORMAT)}
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
                    max={moment(formik.values.end_date)
                      .utc()
                      .format(INPUT_DATE_FORMAT)}
                  />
                </div>

                <span className={classes.separator}>-</span>

                <div className={classes.date}>
                  <Input
                    type="date"
                    {...formik.getFieldProps("end_date")}
                    error={getFormikError(formik, "end_date")}
                    max={moment().utc().format(INPUT_DATE_FORMAT)}
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
        submitButtonDisabled={!formik.isValid || isSecurityProfileReportLoading}
        submitButtonLoading={isSecurityProfileReportLoading}
        submitButtonText="Generate CSV"
        hasBackButton
        onBackButtonPress={() => {
          setPageParams({ action: "view" });
        }}
        onCancel={() => {
          setPageParams({ action: "", securityProfile: -1 });
        }}
      />
    </>
  );
};

export default SecurityProfileDownloadAuditForm;
