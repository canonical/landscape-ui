import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { INPUT_DATE_FORMAT } from "@/constants";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { ROUTES } from "@/libs/routes";
import { getFormikError } from "@/utils/formikErrors";
import {
  Accordion,
  CheckboxInput,
  Form,
  Input,
} from "@canonical/react-components";
import { useFormik } from "formik";
import moment from "moment";
import { useCallback, useMemo, useState, type FC } from "react";
import { useNavigate } from "react-router";
import classNames from "classnames";
import { SortableFieldList } from "@/features/exports";
import { useExportActivitiesCsv } from "../../api/useExportActivitiesCsv";
import classes from "./ActivitiesExportForm.module.scss";
import {
  EXPORT_FIELD_GROUPS,
  INITIAL_VALUES,
  VALIDATION_SCHEMA,
} from "./constants";
import { buildActivityExportQuery } from "./helpers";
import type {
  ActivityListParams,
  ExportField,
  ActivitiesExportFormValues,
  StepIndex,
} from "./types";

interface ActivitiesExportFormProps {
  readonly exportParams: ActivityListParams;
  readonly activityCount: number | undefined;
  readonly selectedActivityCount?: number;
  readonly selectedActivityIds?: number[];
}

const ActivitiesExportForm: FC<ActivitiesExportFormProps> = ({
  exportParams,
  activityCount: _activityCount,
  selectedActivityCount: _selectedActivityCount,
  selectedActivityIds,
}) => {
  const { closeSidePanel } = useSidePanel();
  const { notify } = useNotify();
  const navigate = useNavigate();
  const debug = useDebug();
  const { exportActivitiesCsv, isExportActivitiesCsvLoading } =
    useExportActivitiesCsv();
  const [step, setStep] = useState<StepIndex>(0);
  const [attributeSearch, setAttributeSearch] = useState("");
  const [orderedFields, setOrderedFields] = useState<ExportField[]>([]);

  const handleBack = () => {
    setStep(0);
  };

  const formik = useFormik<ActivitiesExportFormValues>({
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
      const query = buildActivityExportQuery({
        query: exportParams.query,
        selectedActivityIds,
      });

      try {
        const response = await exportActivitiesCsv({
          name: values.name.trim(),
          query,
          selected_activity_ids: selectedActivityIds ?? [],
          selected_field_ids: fieldsToExport.map((field) => field.id),
          retain_until: moment(values.retainUntil).toISOString(),
        });
        const job = response.data;

        closeSidePanel();
        notify.success({
          title: "TSV export in progress",
          message: `Your activities export "${values.name.trim()}"${exportParams.query ? ` for "${exportParams.query}"` : ""} is being generated.`,
          actions: [
            {
              label: "View export status",
              onClick: () =>
                navigate(
                  ROUTES.exports.root({ sidePath: ["view"], name: job.id }),
                ),
            },
          ],
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
            type="date"
            label="Keep until"
            required
            min={moment().add(1, "day").format(INPUT_DATE_FORMAT)}
            max={moment().add(100, "years").format(INPUT_DATE_FORMAT)}
            error={getFormikError(formik, "retainUntil")}
            {...formik.getFieldProps("retainUntil")}
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
      {step === 0 && (
        <p className={classes.description}>
          Name your export, select the attributes you want to include, and
          filter the list if needed.
        </p>
      )}

      {stepContent}

      <SidePanelFormButtons
        hasBackButton={step === 1}
        onBackButtonPress={step === 1 ? handleBack : undefined}
        submitButtonDisabled={
          (step === 0 &&
            (!formik.values.name.trim() ||
              formik.values.selectedFieldIds.length === 0)) ||
          isExportActivitiesCsvLoading ||
          formik.isSubmitting
        }
        submitButtonText={step === 0 ? "Next" : "Generate TSV"}
        onCancel={closeSidePanel}
      />
    </Form>
  );
};

export default ActivitiesExportForm;
