import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { ROUTES } from "@/libs/routes";
import {
  ExportForm,
  type ExportField,
  type ExportFormValues,
} from "@/features/exports";
import { EXPORT_FIELD_GROUPS } from "@/features/instances/components/InstancesExportForm/constants";
import { CheckboxInput, Select } from "@canonical/react-components";
import moment from "moment";
import { useState, type FC } from "react";
import { useNavigate } from "react-router";
import { useExportComplianceTsv } from "../../api/useExportComplianceTsv";
import {
  BUCKET_OPTIONS,
  INITIAL_EXPORT_VALUES,
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
  const { closeSidePanel } = useSidePanel();
  const { notify } = useNotify();
  const navigate = useNavigate();
  const debug = useDebug();
  const { exportComplianceTsv, isExportComplianceTsvLoading } =
    useExportComplianceTsv();

  const [selectedBucket, setSelectedBucket] = useState<BucketKey>("over-60");
  const [includeOther, setIncludeOther] = useState(false);
  const [byCve, setByCve] = useState(false);

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
    if (emptyBucket) return;
    try {
      const response = await exportComplianceTsv({
        name: values.name.trim(),
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
      <CheckboxInput
        label="Include Other"
        checked={includeOther}
        onChange={() => {
          setIncludeOther((v) => !v);
        }}
      />
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
      <ExportForm
        fieldGroups={EXPORT_FIELD_GROUPS}
        initialValues={INITIAL_EXPORT_VALUES}
        isSubmitting={isExportComplianceTsvLoading}
        onGenerate={handleGenerate}
      />
    </>
  );
};

export default ReportExportForm;
