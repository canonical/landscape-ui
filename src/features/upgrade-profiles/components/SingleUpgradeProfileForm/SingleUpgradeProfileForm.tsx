import AssociationBlock from "@/components/form/AssociationBlock";
import ReadOnlyField from "@/components/form/ReadOnlyField";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { getFormikError } from "@/utils/formikErrors";
import { getTitleByName } from "@/utils/_helpers";
import { Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import type { CreateUpgradeProfileParams } from "../../hooks";
import { useUpgradeProfiles } from "../../hooks";
import type { FormProps } from "../../types";
import UpgradeProfileScheduleBlock from "../UpgradeProfileScheduleBlock";
import { CTA_LABELS, NOTIFICATION_ACTIONS } from "./constants";
import { getInitialValues, getValidationSchema } from "./helpers";
import type { SingleUpgradeProfileFormProps } from "./types";

const SingleUpgradeProfileForm: FC<SingleUpgradeProfileFormProps> = (props) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { popSidePathUntilClear, closeSidePanel } = usePageParams();
  const { createUpgradeProfileQuery, editUpgradeProfileQuery } =
    useUpgradeProfiles();
  const { getAccessGroupQuery } = useRoles();

  const { data: accessGroupsData } = getAccessGroupQuery(
    {},
    { enabled: props.action === "add" },
  );

  const accessGroupOptions =
    accessGroupsData?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const { mutateAsync: createUpgradeProfile } = createUpgradeProfileQuery;
  const { mutateAsync: editUpgradeProfile } = editUpgradeProfileQuery;

  const handleSubmit = async (values: FormProps) => {
    const valuesToSubmit: CreateUpgradeProfileParams = {
      all_computers: values.all_computers,
      at_minute: values.at_minute as number,
      autoremove: values.autoremove,
      deliver_within: values.deliver_within,
      every: values.every,
      on_days: values.on_days,
      title: values.title,
      upgrade_type: values.upgrade_type,
    };

    if (props.action === "add") {
      valuesToSubmit.access_group = values.access_group;
    }

    if (values.every === "week") {
      valuesToSubmit.at_hour = values.at_hour as number;
    }

    if (values.randomize_delivery) {
      valuesToSubmit.deliver_delay_window = `${values.deliver_delay_window}`;
    }

    if (!values.all_computers && values.tags.length) {
      valuesToSubmit.tags = values.tags;
    }

    try {
      if (props.action === "edit") {
        await editUpgradeProfile({
          all_computers: valuesToSubmit.all_computers,
          at_hour: valuesToSubmit.at_hour,
          at_minute: valuesToSubmit.at_minute,
          autoremove: valuesToSubmit.autoremove,
          deliver_delay_window: valuesToSubmit.deliver_delay_window,
          deliver_within: valuesToSubmit.deliver_within,
          every: valuesToSubmit.every,
          name: props.profile.name,
          on_days: valuesToSubmit.on_days,
          tags: valuesToSubmit.tags,
          title: valuesToSubmit.title,
          upgrade_type: valuesToSubmit.upgrade_type,
        });
      } else {
        await createUpgradeProfile(valuesToSubmit);
      }

      closeSidePanel();

      notify.success({
        message: `Upgrade profile "${values.title}" has been ${NOTIFICATION_ACTIONS[props.action]} `,
        title: `Upgrade profile ${NOTIFICATION_ACTIONS[props.action]}`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const initialValues = getInitialValues(props);

  const formik = useFormik<FormProps>({
    initialValues,
    onSubmit: handleSubmit,
    validationSchema: getValidationSchema(props.action),
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        required={props.action === "add"}
        label="Title"
        {...formik.getFieldProps("title")}
        error={getFormikError(formik, "title")}
      />

      <Input
        type="checkbox"
        label="Only upgrade security issues"
        help="Regular upgrades will not be applied"
        {...formik.getFieldProps("upgrade_type")}
        checked={formik.values.upgrade_type === "security"}
        onChange={async () =>
          formik.setFieldValue(
            "upgrade_type",
            formik.values.upgrade_type === "all" ? "security" : "all",
          )
        }
      />

      <Input
        type="checkbox"
        label="Remove packages that are no longer needed"
        help="This will affect packages installed to satisfy dependencies that are no longer required after upgrading."
        {...formik.getFieldProps("autoremove")}
        checked={formik.values.autoremove}
      />

      {props.action === "edit" ? (
        <ReadOnlyField
          label="Access group"
          value={getTitleByName(props.profile.access_group, accessGroupsData)}
          tooltipMessage="You can't change the access group after the upgrade profile has been created"
        />
      ) : (
        <Select
          label="Access group"
          aria-label="Access group"
          options={accessGroupOptions}
          {...formik.getFieldProps("access_group")}
          error={getFormikError(formik, "access_group")}
        />
      )}

      <UpgradeProfileScheduleBlock formik={formik} />

      <AssociationBlock formik={formik} />

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText={CTA_LABELS[props.action]}
        onCancel={popSidePathUntilClear}
      />
    </Form>
  );
};

export default SingleUpgradeProfileForm;
