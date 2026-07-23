import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import { ROUTES } from "@/libs/routes";
import {
  ExportForm,
  type ExportField,
  type ExportFormValues,
  type StepIndex,
} from "@/features/exports";
import {
  CheckboxInput,
  Notification,
  Select,
} from "@canonical/react-components";
import moment from "moment";
import { useMemo, useState, type FC } from "react";
import { useNavigate } from "react-router";
import { useExportComplianceTsv } from "../../api/useExportComplianceTsv";
import ReportHelpTooltip from "../ReportHelpTooltip";
import classes from "./ReportExportForm.module.scss";
import {
  BUCKET_OPTIONS,
  buildExportDescription,
  INITIAL_EXPORT_VALUES,
  REPORT_EXPORT_FIELD_GROUPS,
  type BucketKey,
} from "./constants";

interface ReportExportFormProps {
  readonly bucketIds: Record<BucketKey, readonly number[]>;
  readonly otherIds: readonly number[];
}

const ReportExportForm: FC<ReportExportFormProps> = ({
  bucketIds,
  otherIds,
}) => {
  const { closeSidePanel } = usePageParams();
  const { notify } = useNotify();
  const navigate = useNavigate();
  const debug = useDebug();
  const { exportComplianceTsv, isExportComplianceTsvLoading } =
    useExportComplianceTsv();

  const [selectedBucket, setSelectedBucket] = useState<BucketKey>("over-60");
  const [includeOther, setIncludeOther] = useState(false);
  const [byCve, setByCve] = useState(false);
  const [exportStep, setExportStep] = useState<StepIndex>(0);

  // Hide aggregate CVE columns when byCve=true — they are always empty in that
  // mode because _build_cve_tsv emits one row per (instance, CVE) and never
  // populates the resolved_cves/unresolved_cves metrics.
  const cveAggregateIds = useMemo(
    () => new Set(["resolved_cves", "unresolved_cves"]),
    [],
  );
  const fieldGroups = useMemo(
    () =>
      byCve
        ? REPORT_EXPORT_FIELD_GROUPS.map((group) => ({
            ...group,
            fields: group.fields.filter((f) => !cveAggregateIds.has(f.id)),
          })).filter((group) => group.fields.length > 0)
        : REPORT_EXPORT_FIELD_GROUPS,
    [byCve, cveAggregateIds],
  );

  const resolvedIds = [
    ...bucketIds[selectedBucket],
    ...(includeOther ? otherIds : []),
  ];
  const emptyBucket = resolvedIds.length === 0;
  const query = `id:${resolvedIds.join(" OR id:")}`;

  const handleGenerate = async ({
    values,
    fieldsToExport,
  }: {
    values: ExportFormValues;
    fieldsToExport: ExportField[];
  }) => {
    if (fieldsToExport.length === 0) {
      notify.info({
        title: "No attributes selected",
        message: "Select at least one attribute to include in the export.",
      });
      return;
    }
    if (resolvedIds.length === 0) {
      return;
    }
    try {
      const description = buildExportDescription(
        selectedBucket,
        includeOther,
        byCve,
      );
      const response = await exportComplianceTsv({
        name: values.name.trim(),
        description,
        query,
        by_cve: byCve,
        selected_field_ids: fieldsToExport.map((f) => f.id),
        retain_until: moment(values.retainUntil).toISOString(),
      });
      const job = response.data;
      closeSidePanel();
      notify.success({
        title: "TSV export in progress",
        message: `Your compliance export "${values.name.trim()}" is being generated.`,
        actions: [
          {
            label: "View export status",
            onClick: () =>
              navigate(
                ROUTES.exports.root({
                  sidePath: ["view"],
                  name: String(job.id),
                }),
              ),
          },
        ],
      });
    } catch (error) {
      debug(error);
    }
  };

  return (
    <>
      {emptyBucket && (
        <Notification severity="caution">
          The selected bucket contains no instances. Choose a different date
          range
          {otherIds.length > 0 && " or include Other"}.
        </Notification>
      )}
      {exportStep === 0 && (
        <>
          <Select
            label="Time to patch USNs"
            options={BUCKET_OPTIONS.map((o) => ({
              label: o.label,
              value: o.value,
            }))}
            value={selectedBucket}
            onChange={(e) => {
              setSelectedBucket(e.target.value as BucketKey);
            }}
          />
          {otherIds.length > 0 && (
            <CheckboxInput
              label="Include instances with no date range (Other)"
              checked={includeOther}
              onChange={() => {
                setIncludeOther((v) => !v);
              }}
            />
          )}
          <div className={classes.includeOtherRow}>
            <CheckboxInput
              label="Report by CVE"
              checked={byCve}
              onChange={() => {
                setByCve((v) => !v);
              }}
            />
            <div className={classes.includeOtherTooltip}>
              <ReportHelpTooltip
                message={
                  "CVE exports add a cve_id and status column and emit one row per instance and CVE. The fields selected below are included on every row."
                }
              />
            </div>
          </div>
        </>
      )}
      <ExportForm
        fieldGroups={fieldGroups}
        initialValues={INITIAL_EXPORT_VALUES}
        isSubmitting={isExportComplianceTsvLoading}
        onGenerate={handleGenerate}
        onStepChange={setExportStep}
        sortableNote={
          byCve
            ? "cve_id and cve_status will always be the first two columns in this export."
            : undefined
        }
      />
    </>
  );
};

export default ReportExportForm;
