import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { INPUT_DATE_FORMAT } from "@/constants";
import usePageParams from "@/hooks/usePageParams";
import { getFormikError } from "@/utils/formikErrors";
import {
  CheckboxInput,
  Form,
  Input,
  Notification,
  SearchBox,
} from "@canonical/react-components";
import { Accordion } from "@canonical/react-ds-global";
import classNames from "classnames";
import { useFormik } from "formik";
import { type ReactNode, useCallback, useMemo, useState, type FC } from "react";
import date from "@/libs/date";
import SortableFieldList from "../SortableFieldList";
import { getFilteredFieldGroups, getGroupSearchRank } from "./helpers";
import { VALIDATION_SCHEMA } from "./constants";
import classes from "./ExportForm.module.scss";
import type {
  ExportField,
  ExportFieldGroup,
  ExportFormValues,
  StepIndex,
} from "../../types/ExportForm";
import Blocks from "@/components/layout/Blocks";

interface ExportFormProps {
  readonly fieldGroups: readonly ExportFieldGroup[];
  readonly initialValues: ExportFormValues;
  readonly isSubmitting: boolean;
  readonly onGenerate: (args: {
    values: ExportFormValues;
    fieldsToExport: ExportField[];
  }) => Promise<void>;
  readonly onStepChange?: (step: StepIndex) => void;
  readonly sortableNote?: ReactNode;
}

const ExportForm: FC<ExportFormProps> = ({
  fieldGroups,
  initialValues,
  isSubmitting,
  onGenerate,
  onStepChange,
  sortableNote,
}) => {
  const { popSidePath } = usePageParams();
  const [step, setStep] = useState<StepIndex>(0);
  const [attributeSearch, setAttributeSearch] = useState("");
  const [orderedFields, setOrderedFields] = useState<ExportField[]>([]);
  const [expandedFieldGroupKey, setExpandedFieldGroupKey] = useState<
    string | null
  >(null);
  const [collapsedSearchGroupKeys, setCollapsedSearchGroupKeys] = useState<
    ReadonlySet<string>
  >(() => new Set());

  const resetFieldGroupExpansion = () => {
    setExpandedFieldGroupKey(null);
    setCollapsedSearchGroupKeys(new Set());
  };

  const handleBack = () => {
    setStep(0);
    onStepChange?.(0);
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
        resetFieldGroupExpansion();
        setStep(1);
        onStepChange?.(1);
        return;
      }

      const selectedFieldIdSet = new Set(
        selectedFields.map((field) => field.id),
      );
      const orderedSelectedFields = orderedFields.filter((field) =>
        selectedFieldIdSet.has(field.id),
      );

      const fieldsToExport = orderedSelectedFields.length
        ? orderedSelectedFields
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

  const filteredFieldGroups = useMemo(
    () => getFilteredFieldGroups(fieldGroups, attributeSearch),
    [attributeSearch, fieldGroups],
  );

  const isSearching = !!attributeSearch.trim();

  const orderedFieldGroups = useMemo(() => {
    if (!isSearching) {
      return filteredFieldGroups;
    }

    return [...filteredFieldGroups].sort(
      (a, b) =>
        getGroupSearchRank(a.key, filteredFieldGroups, attributeSearch) -
        getGroupSearchRank(b.key, filteredFieldGroups, attributeSearch),
    );
  }, [attributeSearch, filteredFieldGroups, isSearching]);

  // Outside search only one group is open at a time; during search every
  // matching group starts open and can be collapsed individually.
  const isFieldGroupExpanded = (groupKey: string) =>
    isSearching
      ? !collapsedSearchGroupKeys.has(groupKey)
      : expandedFieldGroupKey === groupKey;

  const handleFieldGroupExpandedChange = (
    groupKey: string,
    expanded: boolean,
  ) => {
    // `<details>` also fires `toggle` when React applies `open`; ignore those.
    if (expanded === isFieldGroupExpanded(groupKey)) {
      return;
    }

    if (isSearching) {
      setCollapsedSearchGroupKeys((current) => {
        const next = new Set(current);

        if (expanded) {
          next.delete(groupKey);
        } else {
          next.add(groupKey);
        }

        return next;
      });
      return;
    }

    setExpandedFieldGroupKey(expanded ? groupKey : null);
  };

  const accordionItems = orderedFieldGroups.map((group) => {
    const groupIds = group.fields.map((field) => field.id);
    const allSelected = groupIds.every((id) =>
      formik.values.selectedFieldIds.includes(id),
    );
    const someSelected =
      !allSelected &&
      groupIds.some((id) => formik.values.selectedFieldIds.includes(id));

    return (
      <div className={classes.attributeGroup} key={group.key}>
        <CheckboxInput
          className={classes.groupCheckbox}
          label=""
          labelClassName={classes.groupCheckboxLabel}
          checked={allSelected}
          indeterminate={someSelected}
          aria-label={`${group.title} select all`}
          aria-labelledby={undefined}
          disabled={isSearching}
          onChange={() => {
            toggleGroupSelect(group.fields);
          }}
        />
        <Accordion.Item
          expanded={isFieldGroupExpanded(group.key)}
          heading={
            <span className={classes.groupTitle} role="heading" aria-level={5}>
              {group.title}
            </span>
          }
          onExpandedChange={(expanded) => {
            handleFieldGroupExpandedChange(group.key, expanded);
          }}
        >
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
        </Accordion.Item>
      </div>
    );
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
            min={date().add(1, "day").format(INPUT_DATE_FORMAT)}
            max={date().add(100, "years").format(INPUT_DATE_FORMAT)}
            error={getFormikError(formik, "retainUntil")}
            {...formik.getFieldProps("retainUntil")}
          />
          <Blocks>
            <Blocks.Item title="Attributes">
              <SearchBox
                id="export-attributes-searchbox"
                label="Search attributes"
                placeholder="Search attributes"
                externallyControlled
                value={attributeSearch}
                aria-label="Search attributes"
                searchButtonType="button"
                onChange={(value) => {
                  if (!!value.trim() !== isSearching) {
                    resetFieldGroupExpansion();
                  }
                  setAttributeSearch(value);
                }}
              />
            </Blocks.Item>
          </Blocks>
        </div>
        <div className={classNames({ "is-error": !!selectedFieldIdsError })}>
          {!!selectedFieldIdsError && (
            <p className="p-form-validation__message">
              {selectedFieldIdsError}
            </p>
          )}
          {filteredFieldGroups.length ? (
            <Accordion className={classes.accordion}>
              {accordionItems}
            </Accordion>
          ) : (
            <p className={classes.emptyState}>
              No attributes match your search.
            </p>
          )}
        </div>
      </>
    ) : (
      <>
        {sortableNote && (
          <Notification severity="information" title="Note">
            <span>{sortableNote}</span>
          </Notification>
        )}
        <SortableFieldList
          fields={orderedFields}
          onOrderChange={setOrderedFields}
        />
      </>
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
