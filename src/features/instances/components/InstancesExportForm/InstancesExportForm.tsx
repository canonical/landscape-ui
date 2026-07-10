import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
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
import { useExportInstancesTsv } from "../../api/useExportInstancesTsv";
import type { InstanceListParams } from "../../helpers";
import { EXPORT_FIELD_GROUPS } from "./constants";
import { getInitialValues } from "./helpers";

interface InstancesExportFormProps {
  readonly exportParams: InstanceListParams;
  readonly selectedInstanceIds?: number[];
}

const InstancesExportForm: FC<InstancesExportFormProps> = ({
  exportParams,
  selectedInstanceIds,
}) => {
  const { notify } = useNotify();
  const navigate = useNavigate();
  const debug = useDebug();
  const { exportInstancesTsv, isExportInstancesTsvLoading } =
    useExportInstancesTsv();
  const { disabledColumns, popSidePath } = usePageParams();

  const handleGenerate = async ({
    values,
    fieldsToExport,
  }: {
    values: ExportFormValues;
    fieldsToExport: ExportField[];
  }) => {
    const query = buildExportQuery({
      query: exportParams.query,
      selectedIds: selectedInstanceIds,
    });

    try {
      const response = await exportInstancesTsv({
        name: values.name.trim(),
        query,
        archived_only: exportParams.archived_only,
        wsl_children: exportParams.wsl_children,
        wsl_parents: exportParams.wsl_parents,
        selected_field_ids: fieldsToExport.map((field) => field.id),
        retain_until: moment(values.retainUntil).toISOString(),
      });
      const job = response.data;
      const exportScope = getExportScope({
        query: exportParams.query,
        selectedCount: selectedInstanceIds?.length,
        selectionForms: ["selected instance", "selected instances"],
      });

      popSidePath();
      notify.success({
        title: "TSV export in progress",
        message: `Your instances export "${values.name.trim()}"${exportScope} is being generated.`,
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
      initialValues={getInitialValues(disabledColumns)}
      isSubmitting={isExportInstancesTsvLoading}
      onGenerate={handleGenerate}
    />
  );
};

export default InstancesExportForm;
