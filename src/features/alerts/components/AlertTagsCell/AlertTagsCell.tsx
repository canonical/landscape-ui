import MultiSelectField from "@/components/form/MultiSelectField";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import type { MultiSelectItem } from "@canonical/react-components";
import { Button, Form } from "@canonical/react-components";
import type { AxiosResponse } from "axios";
import { useFormik } from "formik";
import type { FC } from "react";
import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { useAlerts } from "../../hooks";
import type { Alert } from "../../types";
import classes from "./AlertTagsCell.module.scss";
import { findExclusiveTags } from "./helpers";

interface AlertTagsCellProps {
  readonly alert: Alert;
  readonly availableTagOptions: MultiSelectItem[];
}

const AlertTagsCell: FC<AlertTagsCellProps> = ({
  alert,
  availableTagOptions,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { associateAlert, disassociateAlert } = useAlerts();
  const multiSelectFieldRef = useRef<HTMLDivElement>(null);

  const { mutateAsync: associateMutate } = associateAlert;
  const { mutateAsync: disassociateMutate } = disassociateAlert;

  const initialTags = alert.all_computers ? ["All"] : alert.tags;

  const handleSubmit = async ({ tags: selectedTags }: { tags: string[] }) => {
    try {
      const deselectedTags = findExclusiveTags(alert.tags, selectedTags);
      const newlySelectedTags = findExclusiveTags(selectedTags, alert.tags);
      const selectedAllInstances = selectedTags.includes("All");
      const deselectedAllInstances =
        alert.all_computers && !selectedAllInstances;

      if (selectedAllInstances) {
        await associateMutate({
          name: alert.alert_type,
          tags: undefined,
          all_computers: true,
        });
      } else if (deselectedAllInstances) {
        await Promise.all([
          associateMutate({
            name: alert.alert_type,
            tags: selectedTags.filter((tag) => tag !== "All"),
            all_computers: false,
          }),
          disassociateMutate({
            name: alert.alert_type,
            all_computers: true,
          }),
        ]);
      } else {
        const promises: Promise<AxiosResponse<Alert>>[] = [];

        if (newlySelectedTags.length > 0) {
          promises.push(
            associateMutate({
              name: alert.alert_type,
              tags: newlySelectedTags,
              all_computers: false,
            }),
          );
        }

        if (deselectedTags.length > 0) {
          promises.push(
            disassociateMutate({
              name: alert.alert_type,
              tags: deselectedTags,
              all_computers: false,
            }),
          );
        }

        await Promise.all(promises);
      }

      notify.success({
        title: "Alert tags updated",
        message: `You changed ${alert.label}'s tags`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: { tags: initialTags },
    validationSchema: Yup.object().shape({
      tags: Yup.array().of(Yup.string()),
    }),
    onSubmit: handleSubmit,
  });

  const disabledItems = formik.values.tags.includes("All")
    ? availableTagOptions.filter(({ value }) => value !== "All")
    : undefined;

  const selectedItems = formik.values.tags.includes("All")
    ? availableTagOptions
    : availableTagOptions.filter(({ value }) =>
        formik.values.tags.includes(value as string),
      );

  const updateItems = (items: MultiSelectItem[]) => {
    const newTags = items.some(({ value }) => value === "All")
      ? ["All"]
      : items.map(({ value }) => value as string);
    formik.setValues({ tags: newTags });
  };

  useEffect(() => {
    const label = multiSelectFieldRef.current?.querySelector(
      ".multi-select__condensed-text",
    );
    if (label?.textContent?.includes("All instances")) {
      label.textContent = "All instances";
    }
  }, [formik.values.tags]);

  const isDisabled = () => {
    if (formik.isSubmitting) {
      return true;
    }
    return (
      initialTags.length === formik.values.tags.length &&
      initialTags.every((tag) => formik.values.tags.includes(tag))
    );
  };

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <MultiSelectField
        innerRef={multiSelectFieldRef}
        required
        variant="condensed"
        className={classes.multiSelect}
        items={availableTagOptions}
        selectedItems={selectedItems}
        disabledItems={disabledItems}
        onItemsUpdate={updateItems}
        placeholder="Select tags"
        error={
          formik.touched.tags && typeof formik.errors.tags === "string"
            ? formik.errors.tags
            : undefined
        }
        dropdownFooter={
          <div className={classes.footer}>
            <Button
              type="button"
              dense
              small
              className="u-no-margin--bottom"
              disabled={isDisabled()}
              onClick={() => formik.setFieldValue("tags", initialTags)}
            >
              Revert
            </Button>
            <Button
              type="button"
              dense
              small
              appearance="positive"
              className="u-no-margin--bottom"
              disabled={isDisabled()}
              onClick={() => formik.submitForm()}
            >
              Save changes
            </Button>
          </div>
        }
      />
    </Form>
  );
};

export default AlertTagsCell;
