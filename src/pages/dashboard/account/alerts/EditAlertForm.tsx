import { CheckboxInput, Form } from "@canonical/react-components";
import { AxiosResponse } from "axios";
import { useFormik } from "formik";
import { FC } from "react";
import * as Yup from "yup";
import SidePanelFormButtons from "../../../../components/form/SidePanelFormButtons";
import useAlerts from "../../../../hooks/useAlerts";
import useDebug from "../../../../hooks/useDebug";
import useSidePanel from "../../../../hooks/useSidePanel";
import { Alert } from "../../../../types/Alert";
import CheckboxGroup from "../../../../components/form/CheckboxGroup";

function findExclusiveTags(sourceTags: string[], tagsToExclude: string[]) {
  const exclustionSet = new Set(tagsToExclude);
  return sourceTags.filter((tag) => !exclustionSet.has(tag));
}

interface FormProps {
  all_computers: boolean;
  tags: string[];
}

interface EditAlertFormProps {
  alert: Alert;
}

const EditAlertForm: FC<EditAlertFormProps> = ({ alert }) => {
  const TAG_OPTIONS = alert.tags.map((tag) => ({ label: tag, value: tag }));
  const { closeSidePanel } = useSidePanel();
  const { associateAlert, disassociateAlert } = useAlerts();
  const { mutateAsync: associateMutate, isLoading: associateLoading } =
    associateAlert;
  const { mutateAsync: disassociateMutate, isLoading: disassociateLoading } =
    disassociateAlert;
  const debug = useDebug();
  const formik = useFormik<FormProps>({
    initialValues: {
      all_computers: alert.all_computers,
      tags: alert.tags,
    },
    validationSchema: Yup.object().shape({
      all_computers: Yup.boolean(),
      tags: Yup.array().of(Yup.string()),
    }),
    onSubmit: async (values) => {
      try {
        const disassociatedTags = findExclusiveTags(alert.tags, values.tags);
        const promises: Promise<AxiosResponse<Alert>>[] = [];
        if (values.all_computers) {
          promises.push(
            associateMutate({
              name: alert.alert_type,
              tags: undefined,
              all_computers: values.all_computers,
            }),
          );
        } else {
          promises.push(
            disassociateMutate({
              name: alert.alert_type,
              tags: undefined,
              all_computers: true,
            }),
          );
        }
        if (disassociatedTags.length > 0) {
          promises.push(
            disassociateMutate({
              name: alert.alert_type,
              tags: disassociatedTags,
              all_computers: false,
            }),
          );
        }
        await Promise.all(promises);
        closeSidePanel();
      } catch (error) {
        debug(error);
      }
    },
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <CheckboxInput
        label="All computers"
        checked={formik.values.all_computers}
        {...formik.getFieldProps("all_computers")}
        onChange={(event) => {
          formik.getFieldProps("all_computers").onChange(event);
          formik.setFieldValue(
            "tags",
            TAG_OPTIONS.map((tag) => tag.value),
          );
        }}
      />
      {alert.tags.length > 0 ? (
        <CheckboxGroup
          label="Tags"
          disabled={formik.values.all_computers}
          options={TAG_OPTIONS}
          {...formik.getFieldProps("tags")}
          onChange={(newOptions) => {
            formik.setFieldValue("tags", newOptions);
          }}
        />
      ) : (
        <p>No tags applied to this alert</p>
      )}
      <SidePanelFormButtons
        disabled={associateLoading || disassociateLoading}
        submitButtonText="Save changes"
        removeButtonMargin
      />
    </Form>
  );
};

export default EditAlertForm;
