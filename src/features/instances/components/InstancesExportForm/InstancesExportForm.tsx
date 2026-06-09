import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { getFormikError } from "@/utils/formikErrors";
import {
  Accordion,
  CheckboxInput,
  Form,
  Input,
} from "@canonical/react-components";
import { useFormik } from "formik";
import {
  useCallback,
  useMemo,
  useState,
  type FC,
} from "react";
import { useExportInstancesCsv } from "../../api/useExportInstancesCsv";
import type { InstanceListParams } from "../../helpers";
import classes from "./InstancesExportForm.module.scss";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import { EXPORT_FIELD_GROUPS } from "./constants";
import { buildExportQuery } from "./helpers";
import type {
  ExportField,
  InstancesExportFormValues,
  StepIndex,
} from "./types";
import classNames from "classnames";
import SortableFieldList from "./components/SortableFieldList";

interface InstancesExportFormProps {
  readonly exportParams: InstanceListParams;
  readonly instanceCount: number | undefined;
  readonly selectedInstanceCount?: number;
  readonly selectedInstanceIds?: number[];
}

const InstancesExportForm: FC<InstancesExportFormProps> = ({
  exportParams,
  instanceCount: _instanceCount,
  selectedInstanceCount: _selectedInstanceCount,
  selectedInstanceIds,
}) => {
  const { closeSidePanel } = useSidePanel();
  const { notify } = useNotify();
  const debug = useDebug();
  const { exportInstancesCsv, isExportInstancesCsvLoading } =
    useExportInstancesCsv();
  const [step, setStep] = useState<StepIndex>(0);
  const [attributeSearch, setAttributeSearch] = useState("");
  const [orderedFields, setOrderedFields] = useState<ExportField[]>([]);

  const formik = useFormik<InstancesExportFormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      const selectedFields = EXPORT_FIELD_GROUPS.flatMap(
        (group) => group.fields,
      ).filter((field) => values.selectedFieldIds.includes(field.id));

      if (step === 0) {
        setOrderedFields(selectedFields);
        setStep(1);
        return;
      }

      const fieldsToExport = orderedFields.length
        ? orderedFields
        : selectedFields;
      const query = buildExportQuery({
        query: exportParams.query,
        selectedInstanceIds,
      });

      try {
        await exportInstancesCsv({
          name: values.name.trim(),
          query,
          archived_only: exportParams.archived_only,
          wsl_children: exportParams.wsl_children,
          wsl_parents: exportParams.wsl_parents,
          selected_field_ids: fieldsToExport.map((field) => field.id),
        });

        closeSidePanel();
        notify.info({
          title: "TSV export in progress",
          message: `Your instances export "${values.name.trim()}"${exportParams.query ? ` for "${exportParams.query}"` : ""} is being generated. You can track it from the instances page.`,
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  const toggleField = useCallback(
    (fieldId: string) => {
      const nextSelectedFieldIds = formik.values.selectedFieldIds.includes(
        fieldId,
      )
        ? formik.values.selectedFieldIds.filter((id) => id !== fieldId)
        : [...formik.values.selectedFieldIds, fieldId];

      void formik.setFieldTouched("selectedFieldIds", true, false);
      void formik.setFieldValue("selectedFieldIds", nextSelectedFieldIds);
    },
    [formik],
  );

  const toggleGroupSelect = useCallback(
    (groupFields: readonly ExportField[]) => {
      const groupIds = groupFields.map((field) => field.id);
      const allSelected = groupIds.every((id) =>
        formik.values.selectedFieldIds.includes(id),
      );

      const nextSelectedFieldIds = allSelected
        ? formik.values.selectedFieldIds.filter((id) => !groupIds.includes(id))
        : [...new Set([...formik.values.selectedFieldIds, ...groupIds])];

      void formik.setFieldTouched("selectedFieldIds", true, false);
      void formik.setFieldValue("selectedFieldIds", nextSelectedFieldIds);
    },
    [formik],
  );

  const filteredFieldGroups = useMemo(() => {
    const normalizedSearch = attributeSearch.trim().toLowerCase();

    if (!normalizedSearch) {
      return EXPORT_FIELD_GROUPS;
    }

    return EXPORT_FIELD_GROUPS.flatMap((group) => {
      const matchingFields = group.fields.filter((field) =>
        field.label.toLowerCase().includes(normalizedSearch),
      );

      if (!matchingFields.length) {
        return [];
      }

      return [{ ...group, fields: matchingFields }];
    });
  }, [attributeSearch]);

  const accordionSections = filteredFieldGroups.map((group) => {
    const groupIds = group.fields.map((field) => field.id);
    const allSelected = groupIds.every((id) =>
      formik.values.selectedFieldIds.includes(id),
    );
    const someSelected =
      !allSelected &&
      groupIds.some((id) => formik.values.selectedFieldIds.includes(id));

    return {
      key: group.key,
      title: (
        <CheckboxInput
          label={group.title}
          checked={allSelected}
          indeterminate={someSelected}
          aria-label={`${group.title} select all`}
          onChange={() => {
            toggleGroupSelect(group.fields);
          }}
        />
      ),
      content: (
        <div className={classes.optionList}>
          {group.fields.map((field) => (
            <CheckboxInput
              key={field.id}
              checked={formik.values.selectedFieldIds.includes(field.id)}
              label={field.label}
              onChange={() => {
                toggleField(field.id);
              }}
            />
          ))}
        </div>
      ),
    };
  });

  const selectedFieldIdsError = getFormikError(formik, "selectedFieldIds");

  const stepContent =
    step === 0 ? (
      <>
        <div className={classes.stepOneFields}>
          <Input
            type="text"
            label="Export name"
            required
            error={getFormikError(formik, "name")}
            {...formik.getFieldProps("name")}
          />
          <Input
            type="search"
            label="Search attributes"
            placeholder="Search attributes"
            value={attributeSearch}
            onChange={(event) => {
              setAttributeSearch(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
              }
            }}
          />
        </div>
        <div className={classNames({ "is-error": !!selectedFieldIdsError })}>
          {!!selectedFieldIdsError && (
            <p className="p-form-validation__message">
              {selectedFieldIdsError}
            </p>
          )}
          {filteredFieldGroups.length ? (
            <Accordion sections={accordionSections} titleElement="h5" />
          ) : (
            <p className={classes.emptyState}>
              No attributes match your search.
            </p>
          )}
        </div>
      </>
    ) : (
      <SortableFieldList
        fields={orderedFields}
        onOrderChange={setOrderedFields}
      />
    );

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <p className={classes.description}>
        {step === 0
          ? "Name your export, select the attributes you want to include, and filter the list if needed."
          : "Review your selected columns before generating the export."}
      </p>

      {stepContent}

      <SidePanelFormButtons
        hasBackButton={step === 1}
        onBackButtonPress={
          step === 1
            ? () => {
                setStep(0);
              }
            : undefined
        }
        submitButtonDisabled={
          (step === 0 &&
            (!formik.values.name.trim() ||
              formik.values.selectedFieldIds.length === 0)) ||
          isExportInstancesCsvLoading ||
          formik.isSubmitting
        }
        submitButtonText={step === 0 ? "Next" : "Generate TSV"}
        onCancel={closeSidePanel}
      />
    </Form>
  );
};

export default InstancesExportForm;
