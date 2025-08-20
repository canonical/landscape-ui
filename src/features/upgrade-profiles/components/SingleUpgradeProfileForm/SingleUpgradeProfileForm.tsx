import AssociationBlock from "@/components/form/AssociationBlock";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useEffect } from "react";
import type { CreateUpgradeProfileParams } from "../../hooks";
import { useUpgradeProfiles } from "../../hooks";
import type { FormProps, UpgradeProfile } from "../../types";
import UpgradeProfileScheduleBlock from "../UpgradeProfileScheduleBlock";
import { CTA_LABELS, INITIAL_VALUES, NOTIFICATION_ACTIONS } from "./constants";
import { getValidationSchema } from "./helpers";

type SingleUpgradeProfileFormProps =
  | {
      action: "add";
    }
  | {
      action: "edit";
      profile: UpgradeProfile;
    };

const SingleUpgradeProfileForm: FC<SingleUpgradeProfileFormProps> = (props) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { sidePath, popSidePath, setPageParams } = usePageParams();
  const { createUpgradeProfileQuery, editUpgradeProfileQuery } =
    useUpgradeProfiles();
  const { getAccessGroupQuery } = useRoles();

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery(
    {},
    { enabled: props.action === "add" },
  );

  const accessGroupOptions =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const { mutateAsync: createUpgradeProfile } = createUpgradeProfileQuery;
  const { mutateAsync: editUpgradeProfile } = editUpgradeProfileQuery;

  const closeSidePanel = () => {
    setPageParams({ sidePath: [], profile: "" });
  };

  const handleSubmit = async (values: FormProps) => {
    const valuesToSubmit: CreateUpgradeProfileParams = {
      access_group: values.access_group,
      all_computers: values.all_computers,
      at_minute: values.at_minute as number,
      autoremove: values.autoremove,
      deliver_within: values.deliver_within,
      every: values.every,
      on_days: values.on_days,
      title: values.title,
      upgrade_type: values.upgrade_type,
    };

    if (values.every === "week") {
      valuesToSubmit.at_hour = values.at_hour as number;
    }

    if (values.randomizeDelivery) {
      valuesToSubmit.deliver_delay_window =
        values.deliver_delay_window as `${number}`;
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

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: handleSubmit,
    validationSchema: getValidationSchema(props.action),
  });

  useEffect(() => {
    if (props.action !== "edit" || !props.profile) {
      return;
    }

    formik.setValues({
      access_group: props.profile.access_group,
      all_computers: props.profile.all_computers,
      at_hour: props.profile.at_hour ? parseInt(props.profile.at_hour) : "",
      at_minute: parseInt(props.profile.at_minute),
      autoremove: props.profile.autoremove,
      deliver_delay_window: parseInt(props.profile.deliver_delay_window),
      deliver_within: parseInt(props.profile.deliver_within),
      every: props.profile.every,
      on_days: props.profile.on_days ?? [],
      randomizeDelivery: props.profile.deliver_delay_window !== "0",
      tags: props.profile.tags,
      title: props.profile.title,
      upgrade_type: props.profile.upgrade_type,
    });
  }, [props]);

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        required={props.action === "add"}
        label="Title"
        {...formik.getFieldProps("title")}
        error={
          formik.touched.title && formik.errors.title
            ? formik.errors.title
            : undefined
        }
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

      <Select
        label="Access group"
        aria-label="Access group"
        options={accessGroupOptions}
        {...formik.getFieldProps("access_group")}
        error={
          formik.touched.access_group && formik.errors.access_group
            ? formik.errors.access_group
            : undefined
        }
      />

      <UpgradeProfileScheduleBlock formik={formik} />

      <AssociationBlock formik={formik} />

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText={CTA_LABELS[props.action]}
        onCancel={closeSidePanel}
        hasBackButton={sidePath.length > 1}
        onBackButtonPress={popSidePath}
      />
    </Form>
  );
};

export default SingleUpgradeProfileForm;
