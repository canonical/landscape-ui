import { useFormik } from "formik";
import { FC } from "react";
import { Form, Input } from "@canonical/react-components";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import useRoles from "@/hooks/useRoles";
import {
  getAccessGroupOptions,
  getPermissionOptions,
  getSortedOptions,
} from "@/pages/dashboard/settings/roles/helpers";
import PermissionBlock from "@/pages/dashboard/settings/roles/PermissionBlock";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import AccessGroupBlock from "@/pages/dashboard/settings/roles/AccessGroupBlock";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import { getPromisesToAddRole } from "./helpers";
import { FormProps } from "./types";

interface AddRoleFormProps {
  ctaLabel?: "Add" | "Create";
}

const AddRoleForm: FC<AddRoleFormProps> = ({ ctaLabel = "Add" }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const {
    createRoleQuery,
    addPermissionsToRoleQuery,
    addAccessGroupsToRoleQuery,
    getAccessGroupQuery,
    getPermissionsQuery,
  } = useRoles();

  const { data: getPermissionsQueryResult, error: getPermissionsQueryError } =
    getPermissionsQuery();

  if (getPermissionsQueryError) {
    debug(getPermissionsQueryError);
  }

  const permissionOptions = getPermissionsQueryResult
    ? getPermissionOptions(getPermissionsQueryResult.data)
    : [];

  const { data: getAccessGroupQueryResult, error: getAccessGroupQueryError } =
    getAccessGroupQuery();

  if (getAccessGroupQueryError) {
    debug(getAccessGroupQueryError);
  }

  const accessGroupOptions = getAccessGroupQueryResult
    ? getSortedOptions(getAccessGroupOptions(getAccessGroupQueryResult.data))
    : [];

  const { mutateAsync: createRole } = createRoleQuery;
  const { mutateAsync: addPermissions } = addPermissionsToRoleQuery;
  const { mutateAsync: addAccessGroups } = addAccessGroupsToRoleQuery;

  const handleSubmit = async (values: FormProps) => {
    await createRole({
      description: values.description,
      name: values.name,
    });

    const promises = getPromisesToAddRole(values, accessGroupOptions, {
      addAccessGroups,
      addPermissions,
    });

    try {
      await Promise.all(promises);

      closeSidePanel();

      notify.success({
        title: "New role has been added",
        message: `You created the role '${values.name}'`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: handleSubmit,
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        label="Role name"
        required
        autoComplete="off"
        {...formik.getFieldProps("name")}
        error={
          formik.touched.name && formik.errors.name
            ? formik.errors.name
            : undefined
        }
      />

      <Input
        type="text"
        label="Description"
        autoComplete="off"
        {...formik.getFieldProps("description")}
        error={
          formik.touched.description && formik.errors.description
            ? formik.errors.description
            : undefined
        }
      />

      <PermissionBlock
        description="These permissions are for managing the account as a whole. They are not limited to the specified access groups, but instead apply globally."
        onPermissionChange={(newPermissions) =>
          formik.setFieldValue("permissions", newPermissions)
        }
        options={permissionOptions.filter(({ global }) => global)}
        permissions={formik.values.permissions}
        title="Global permissions"
      />

      <PermissionBlock
        description="These permissions only apply to selected access groups."
        onPermissionChange={(newPermissions) =>
          formik.setFieldValue("permissions", newPermissions)
        }
        options={permissionOptions.filter(({ global }) => !global)}
        permissions={formik.values.permissions}
        title="Permissions"
      />

      <AccessGroupBlock
        accessGroupOptions={accessGroupOptions}
        accessGroups={formik.values.access_groups}
        onAccessGroupChange={(newAccessGroups) => {
          formik.setFieldValue("access_groups", newAccessGroups);
        }}
      />

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText={ctaLabel}
      />
    </Form>
  );
};

export default AddRoleForm;
