import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { ROUTES } from "@/libs/routes";
import {
  buildExportQuery,
  ExportForm,
  getExportScope,
  type ExportField,
  type ExportFormValues,
} from "@/features/exports";
import moment from "moment";
import type { FC } from "react";
import { useNavigate } from "react-router";
import { useExportActivitiesTsv } from "../../api/useExportActivitiesTsv";
import { EXPORT_FIELD_GROUPS, INITIAL_VALUES } from "./constants";
import type { ActivityListParams } from "./types";

interface ActivitiesExportFormProps {
  readonly exportParams: ActivityListParams;
  readonly selectedActivityIds?: number[];
}

const ActivitiesExportForm: FC<ActivitiesExportFormProps> = ({
  exportParams,
  selectedActivityIds,
}) => {
  const { closeSidePanel } = useSidePanel();
  const { notify } = useNotify();
  const navigate = useNavigate();
  const debug = useDebug();
  const { exportActivitiesTsv, isExportActivitiesTsvLoading } =
    useExportActivitiesTsv();

  const handleGenerate = async ({
    values,
    fieldsToExport,
  }: {
    values: ExportFormValues;
    fieldsToExport: ExportField[];
  }) => {
    const query = buildExportQuery({
      query: exportParams.query,
      selectedIds: selectedActivityIds,
    });

    try {
      const response = await exportActivitiesTsv({
        name: values.name.trim(),
        query,
        selected_field_ids: fieldsToExport.map((field) => field.id),
        retain_until: moment(values.retainUntil).toISOString(),
      });
      const job = response.data;
      const exportScope = getExportScope({
        query: exportParams.query,
        selectedCount: selectedActivityIds?.length,
        selectionForms: ["selected activity", "selected activities"],
      });

      closeSidePanel();
      notify.success({
        title: "TSV export in progress",
        message: `Your activities export "${values.name.trim()}"${exportScope} is being generated.`,
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
    <ExportForm
      fieldGroups={EXPORT_FIELD_GROUPS}
      initialValues={INITIAL_VALUES}
      isSubmitting={isExportActivitiesTsvLoading}
      onGenerate={handleGenerate}
    />
  );
};

export default ActivitiesExportForm;
