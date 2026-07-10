import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { INPUT_DATE_FORMAT } from "@/constants";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import {
  Accordion,
  CheckboxInput,
  Form,
  Input,
  SearchBox,
} from "@canonical/react-components";
import classNames from "classnames";
import { useFormik } from "formik";
import moment from "moment";
import { useCallback, useMemo, useState, type FC } from "react";
import SortableFieldList from "../SortableFieldList";
import { VALIDATION_SCHEMA } from "./constants";
import classes from "./ExportForm.module.scss";
import type {
  ExportField,
  ExportFieldGroup,
  ExportFormValues,
  StepIndex,
} from "../../types/ExportForm";

interface ExportFormProps {
  readonly fieldGroups: readonly ExportFieldGroup[];
  readonly initialValues: ExportFormValues;
  readonly isSubmitting: boolean;
  readonly onGenerate: (args: {
    values: ExportFormValues;
    fieldsToExport: ExportField[];
  }) => Promise<void>;
}

const ExportForm: FC<ExportFormProps> = ({
  fieldGroups,
  initialValues,
  isSubmitting,
  onGenerate,
}) => {
  const { popSidePath } = usePageParams();
  const [step, setStep] = useState<StepIndex>(0);
  const [attributeSearch, setAttributeSearch] = useState("");
  const [orderedFields, setOrderedFields] = useState<ExportField[]>([]);

  const handleBack = () => {
    setStep(0);
  };

  const formik = useFormik<ExportFormValues>({
    initialValues,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      const selectedFields = fieldGroups
        .flatMap((group) =>
          group.fields.map((field) => ({ ...field, groupTitle: group.title })),
        )
        .filter((field) => values.selectedFieldIds.includes(field.id));

      if (step === 0) {
        setOrderedFields(selectedFields);
        setStep(1);
        return;
      }

      const fieldsToExport = orderedFields.length
        ? orderedFields
        : selectedFields;

      await onGenerate({ values, fieldsToExport });
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
      return fieldGroups;
    }

    return fieldGroups.flatMap((group) => {
      const matchingFields = group.fields.filter((field) =>
        field.label.toLowerCase().includes(normalizedSearch),
      );

      if (!matchingFields.length) {
        return [];
      }

      return [{ ...group, fields: matchingFields }];
    });
  }, [attributeSearch, fieldGroups]);

  const accordionSections = filteredFieldGroups.map((group) => {
    const groupIds = group.fields.map((field) => field.id);
    const allSelected = groupIds.every((id) =>
      formik.values.selectedFieldIds.includes(id),
    );
    const someSelected =
      !allSelected &&
      groupIds.some((id) => formik.values.selectedFieldIds.includes(id));

    const isSearching = !!attributeSearch.trim();

    return {
      key: group.key,
      title: (
        <CheckboxInput
          label={group.title}
          labelClassName="export-form-group-title-checkbox"
          checked={allSelected}
          indeterminate={someSelected}
          aria-label={`${group.title} select all`}
          disabled={isSearching}
          onChange={() => {
            if (!isSearching) toggleGroupSelect(group.fields);
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

  const renderFieldGroups = () => {
    if (!filteredFieldGroups.length) {
      return (
        <p className={classes.emptyState}>No attributes match your search.</p>
      );
    }

    if (attributeSearch.trim()) {
      const needle = attributeSearch.trim().toLowerCase();
      const rank = (label: string) => {
        const hay = label.toLowerCase();
        if (hay === needle) return 0;
        if (hay.startsWith(needle)) return 1;
        return 2;
      };

      const sortedSections = [...accordionSections].sort((a, b) => {
        const aGroup = filteredFieldGroups.find((g) => g.key === a.key);
        const bGroup = filteredFieldGroups.find((g) => g.key === b.key);
        const aRank = aGroup
          ? Math.min(...aGroup.fields.map((f) => rank(f.label)))
          : 2;
        const bRank = bGroup
          ? Math.min(...bGroup.fields.map((f) => rank(f.label)))
          : 2;
        return aRank - bRank;
      });

      return (
        <div>
          {sortedSections.map((section) => (
            <Accordion
              key={`filtered-${section.key}`}
              className="export-form-field-groups-accordion"
              sections={[section]}
              expanded={section.key}
              titleElement="h5"
            />
          ))}
        </div>
      );
    }

    return (
      <div>
        <Accordion
          className="export-form-field-groups-accordion"
          sections={accordionSections}
          titleElement="h5"
        />
      </div>
    );
  };

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
          <p className={classes.attributesLabel}>Attributes</p>
          <SearchBox
            id="export-attributes-searchbox"
            label="Search attributes"
            placeholder="Search attributes"
            externallyControlled
            value={attributeSearch}
            aria-label="Search attributes"
            searchButtonType="button"
            onChange={(value) => {
              setAttributeSearch(value);
            }}
          />
        </div>
        <div className={classNames({ "is-error": !!selectedFieldIdsError })}>
          {!!selectedFieldIdsError && (
            <p className="p-form-validation__message">
              {selectedFieldIdsError}
            </p>
          )}
          {renderFieldGroups()}
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
        submitButtonLoading={isSubmitting || formik.isSubmitting}
        submitButtonText={step === 0 ? "Next" : "Generate TSV"}
        onCancel={popSidePath}
      />
    </Form>
  );
};

export default ExportForm;
