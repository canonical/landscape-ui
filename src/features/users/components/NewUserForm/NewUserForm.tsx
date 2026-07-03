import { Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import { useParams } from "react-router";
import type { UrlParams } from "@/types/UrlParams";
import { getFormikError } from "@/utils/formikErrors";
import {
  NEW_USER_INITIAL_VALUES,
  VALIDATION_SCHEMA,
  PRIMARY_GROUP_PLACEHOLDER_OPTION,
} from "./constants";
import { mapGroupsToOptions } from "./helpers";
import type { NewUserFormValues } from "./types";
import { useCreateUser, useGetGroups } from "../../api";

const NewUserForm: FC = () => {
  const { instanceId: urlInstanceId } = useParams<UrlParams>();
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { createUser, isCreatingUser } = useCreateUser();

  const instanceId = Number(urlInstanceId);

  const { groups: groupsData, isLoadingGroups } = useGetGroups({
    computer_id: instanceId,
  });

  const groupOptions = mapGroupsToOptions(groupsData);

  const formik = useFormik<NewUserFormValues>({
    initialValues: NEW_USER_INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      try {
        await createUser({
          computer_ids: [instanceId],
          name: values.name,
          username: values.username,
          password: values.password,
          require_password_reset: values.requirePasswordReset,
          location: values.location,
          home_phone: values.homePhoneNumber,
          work_phone: values.workPhoneNumber,
          primary_groupname: values.primaryGroupValue,
        });
        closeSidePanel();
      } catch (error) {
        debug(error);
      }
    },
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit} name="add-new-user">
      <Input
        type="text"
        label="Username"
        autoComplete="new-username"
        required
        error={getFormikError(formik, "username")}
        {...formik.getFieldProps("username")}
      />
      <Input
        type="text"
        label="Name"
        required
        error={getFormikError(formik, "name")}
        {...formik.getFieldProps("name")}
      />
      <Input
        type="password"
        label="Password"
        autoComplete="new-password"
        required
        error={getFormikError(formik, "password")}
        {...formik.getFieldProps("password")}
      />
      <Input
        type="password"
        label="Confirm password"
        autoComplete="new-password"
        required
        error={getFormikError(formik, "confirmPassword")}
        {...formik.getFieldProps("confirmPassword")}
      />
      <Input
        type="checkbox"
        label="Require password reset"
        help="User must change password at first login."
        {...formik.getFieldProps("requirePasswordReset")}
        checked={formik.values.requirePasswordReset}
      />
      <Select
        label="Primary Group"
        disabled={isLoadingGroups}
        options={[PRIMARY_GROUP_PLACEHOLDER_OPTION, ...groupOptions]}
        {...formik.getFieldProps("primaryGroupValue")}
        error={getFormikError(formik, "primaryGroupValue")}
      />
      <Input
        type="text"
        label="Location"
        error={getFormikError(formik, "location")}
        {...formik.getFieldProps("location")}
      />
      <Input
        type="text"
        label="Home phone"
        error={getFormikError(formik, "homePhoneNumber")}
        {...formik.getFieldProps("homePhoneNumber")}
      />
      <Input
        type="text"
        label="Work phone"
        error={getFormikError(formik, "workPhoneNumber")}
        {...formik.getFieldProps("workPhoneNumber")}
      />
      <SidePanelFormButtons
        submitButtonDisabled={isCreatingUser}
        submitButtonText="Add user"
      />
    </Form>
  );
};

export default NewUserForm;
