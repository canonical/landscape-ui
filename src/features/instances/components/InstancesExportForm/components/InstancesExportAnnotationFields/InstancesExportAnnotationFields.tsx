import { TableFilter } from "@/components/filter";
import LoadingState from "@/components/layout/LoadingState";
import { useGetExportAnnotationFields } from "../../../../api";
import type { FC } from "react";
import { useState } from "react";
import type { InstanceListParams } from "../../../../helpers";
import classes from "./InstancesExportAnnotationFields.module.scss";

interface InstancesExportAnnotationFieldsProps {
  readonly exportParams: InstanceListParams;
  readonly selectedAnnotationFieldIds: string[];
  readonly onSelectedAnnotationFieldIdsChange: (
    nextAnnotationFieldIds: string[],
  ) => void;
}

const InstancesExportAnnotationFields: FC<
  InstancesExportAnnotationFieldsProps
> = ({
  exportParams,
  selectedAnnotationFieldIds,
  onSelectedAnnotationFieldIdsChange,
}) => {
  const [searchText, setSearchText] = useState("");
  const {
    exportAnnotationFields,
    isErrorExportAnnotationFields,
    isGettingExportAnnotationFields,
  } = useGetExportAnnotationFields(exportParams);

  const filteredAnnotationFields = exportAnnotationFields.filter(({ label }) =>
    label.toLowerCase().includes(searchText.trim().toLowerCase()),
  );

  if (isGettingExportAnnotationFields && exportAnnotationFields.length === 0) {
    return (
      <p className={classes.helperText}>
        <LoadingState inline /> Loading available annotation columns…
      </p>
    );
  }

  if (isErrorExportAnnotationFields) {
    return (
      <p className={classes.helperText}>
        We couldn’t load annotation columns. You can still export the built-in
        instance attributes.
      </p>
    );
  }

  if (exportAnnotationFields.length === 0) {
    return (
      <p className={classes.helperText}>
        No annotations were found for the current filtered instances.
      </p>
    );
  }

  return (
    <TableFilter
      type="multiple"
      label="Select annotation columns"
      hasToggleIcon
      hasBadge
      options={filteredAnnotationFields.map((field) => ({
        label: field.label,
        value: field.id,
      }))}
      selectedItems={selectedAnnotationFieldIds}
      onItemsSelect={onSelectedAnnotationFieldIdsChange}
      onSearch={setSearchText}
      showSelectedItemCount
    />
  );
};

export default InstancesExportAnnotationFields;
