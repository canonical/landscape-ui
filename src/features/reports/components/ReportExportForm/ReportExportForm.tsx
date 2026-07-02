import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { ROUTES } from "@/libs/routes";
import {
  ExportForm,
  type ExportField,
  type ExportFormValues,
} from "@/features/exports";
import { CheckboxInput, Select } from "@canonical/react-components";
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
  readonly otherDetail?: string;
}

const ReportExportForm: FC<ReportExportFormProps> = ({
  bucketIds,
  otherIds,
  otherDetail,
}) => {
  const { closeSidePanel } = useSidePanel();
  const { notify } = useNotify();
  const navigate = useNavigate();
  const debug = useDebug();
  const { exportComplianceTsv, isExportComplianceTsvLoading } =
    useExportComplianceTsv();

  const [selectedBucket, setSelectedBucket] = useState<BucketKey>("over-60");
  const [includeOther, setIncludeOther] = useState(false);
  const [byCve, setByCve] = useState(false);

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
    if (emptyBucket) {
      notify.info({
        title: "No instances in bucket",
        message:
          "The selected bucket contains no instances. Choose a different bucket or include Other.",
      });
      return;
    }

    if (fieldsToExport.length === 0) {
      notify.info({
        title: "No attributes selected",
        message: "Select at least one attribute to include in the export.",
      });
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
      <Select
        label="Bucket"
        options={BUCKET_OPTIONS.map((o) => ({
          label: o.label,
          value: o.value,
        }))}
        value={selectedBucket}
        onChange={(e) => {
          setSelectedBucket(e.target.value as BucketKey);
        }}
      />
      <div className={classes.includeOtherRow}>
        <CheckboxInput
          label="Include Other"
          checked={includeOther}
          onChange={() => {
            setIncludeOther((v) => !v);
          }}
        />
        <div className={classes.includeOtherTooltip}>
          <ReportHelpTooltip
            message={
              otherDetail ||
              "Other includes instances that are not in any of the buckets."
            }
          />
        </div>
      </div>
      {emptyBucket && (
        <p className="p-form-validation__message">
          The selected bucket contains no instances. Choose a different bucket
          or include Other.
        </p>
      )}
      <CheckboxInput
        label="Report by CVE"
        checked={byCve}
        onChange={() => {
          setByCve((v) => !v);
        }}
      />
      {byCve && (
        <p className="u-text--muted">
          <small>
            CVE exports add a cve_id and status column and emit one row per
            instance and CVE. The fields selected below are included on every
            row.
          </small>
        </p>
      )}
      <ExportForm
        fieldGroups={fieldGroups}
        initialValues={INITIAL_EXPORT_VALUES}
        isSubmitting={isExportComplianceTsvLoading}
        onGenerate={handleGenerate}
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
