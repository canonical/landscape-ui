import AssociationBlock from "@/components/form/AssociationBlock";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useEffect } from "react";
import type { CreateRemovalProfileParams } from "../../hooks";
import { useRemovalProfiles } from "../../hooks";
import type { RemovalProfile } from "../../types";
import { CTA_LABELS, INITIAL_VALUES, NOTIFICATION_ACTIONS } from "./constants";
import { getValidationSchema } from "./helpers";
import classes from "./SingleRemovalProfileForm.module.scss";
import type { FormProps } from "./types";

type SingleRemovalProfileFormProps =
  | {
      action: "add";
    }
  | {
      action: "edit";
      profile: RemovalProfile;
    };

const SingleRemovalProfileForm: FC<SingleRemovalProfileFormProps> = (props) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { sidePath, popSidePath, createPageParamsSetter } = usePageParams();
  const { createRemovalProfileQuery, editRemovalProfileQuery } =
    useRemovalProfiles();
  const { getAccessGroupQuery } = useRoles();

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  const { mutateAsync: createRemovalProfile } = createRemovalProfileQuery;
  const { mutateAsync: editRemovalProfile } = editRemovalProfileQuery;

  const closeSidePanel = createPageParamsSetter({ sidePath: [], profile: "" });

  const handleSubmit = async (values: FormProps) => {
    const valuesToSubmit: CreateRemovalProfileParams = {
      title: values.title,
      days_without_exchange: values.days_without_exchange as number,
      access_group: values.access_group,
      all_computers: values.all_computers,
    };

    if (!values.all_computers && values.tags.length > 0) {
      valuesToSubmit.tags = values.tags;
    }

    try {
      if (props.action === "edit") {
        await editRemovalProfile({
          all_computers: valuesToSubmit.all_computers,
          days_without_exchange: valuesToSubmit.days_without_exchange,
          name: props.profile.name,
          tags: valuesToSubmit.tags,
          title: valuesToSubmit.title,
        });
      } else {
        await createRemovalProfile(valuesToSubmit);
      }

      closeSidePanel();

      notify.success({
        message: `Removal profile ${NOTIFICATION_ACTIONS[props.action]}`,
        title: `Removal profile ${values.title} has been ${NOTIFICATION_ACTIONS[props.action]}`,
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
    if (props.action !== "edit") {
      return;
    }

    formik.setValues({
      access_group: props.profile.access_group,
      all_computers: props.profile.all_computers,
      days_without_exchange: props.profile.days_without_exchange,
      tags: props.profile.tags,
      title: props.profile.title,
    });
  }, [props]);

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        label="Title"
        required={props.action === "add"}
        {...formik.getFieldProps("title")}
        error={getFormikError(formik, "title")}
      />

      <div className={classes.inputContainer}>
        <Input
          type="number"
          inputMode="numeric"
          label="Removal timeframe"
          required={props.action === "add"}
          autoComplete="off"
          className={classes.input}
          wrapperClassName={classes.inputWrapper}
          {...formik.getFieldProps("days_without_exchange")}
          error={getFormikError(formik, "days_without_exchange")}
        />

        <span className={classes.inputDescription}>days</span>
      </div>

      <Select
        label="Access group"
        options={accessGroupOptions}
        {...formik.getFieldProps("access_group")}
        error={getFormikError(formik, "access_group")}
      />

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

export default SingleRemovalProfileForm;
