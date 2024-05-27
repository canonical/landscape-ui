import { useFormik } from "formik";
import { FC, useEffect } from "react";
import * as Yup from "yup";
import { Form } from "@canonical/react-components";
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
import { Role } from "@/types/Role";
import AccessGroupBlock from "@/pages/dashboard/settings/roles/AccessGroupBlock";
import { getPromisesToEditRole, getRoleFormProps } from "./helpers";
import { FormProps } from "./types";

const INITIAL_VALUES: FormProps = {
  accessGroups: [],
  permissions: [],
};

const VALIDATION_SCHEMA = Yup.object().shape({
  accessGroups: Yup.array().of(Yup.string()),
  permissions: Yup.array().of(Yup.string()),
});

interface EditRoleFormProps {
  role: Role;
}

const EditRoleForm: FC<EditRoleFormProps> = ({ role }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const {
    addPermissionsToRoleQuery,
    addAccessGroupsToRoleQuery,
    getAccessGroupQuery,
    getPermissionsQuery,
    removeAccessGroupsFromRoleQuery,
    removePermissionsFromRoleQuery,
  } = useRoles();

  const { data: getPermissionsQueryResult } = getPermissionsQuery();

  const permissionOptions = getPermissionsQueryResult
    ? getPermissionOptions(getPermissionsQueryResult.data)
    : [];

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions = getAccessGroupQueryResult
    ? getSortedOptions(getAccessGroupOptions(getAccessGroupQueryResult.data))
    : [];

  const { mutateAsync: addPermissions } = addPermissionsToRoleQuery;
  const { mutateAsync: addAccessGroups } = addAccessGroupsToRoleQuery;
  const { mutateAsync: removeAccessGroups } = removeAccessGroupsFromRoleQuery;
  const { mutateAsync: removePermissions } = removePermissionsFromRoleQuery;

  const handleSubmit = async (values: FormProps) => {
    const promiseObject = getPromisesToEditRole(
      values,
      role,
      accessGroupOptions,
      permissionOptions,
      {
        addAccessGroups,
        addPermissions,
        removeAccessGroups,
        removePermissions,
      },
    );

    if (!Object.values(promiseObject).some(Boolean)) {
      return closeSidePanel();
    }

    try {
      if (
        promiseObject.addPermissionsPromise &&
        promiseObject.removePermissionsPromise
      ) {
        await Promise.all(
          Object.entries(promiseObject)
            .filter(
              ([key, promise]) => key !== "addPermissionsPromise" && promise,
            )
            .map(([, promise]) => promise),
        );

        await promiseObject.addPermissionsPromise;
      } else {
        await Promise.all(Object.values(promiseObject).filter(Boolean));
      }

      closeSidePanel();

      notify.success({
        title: "Role changes have been saved",
        message: `You modified the role '${role.name}'`,
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

  useEffect(() => {
    formik.setValues(
      getRoleFormProps(role, accessGroupOptions, permissionOptions),
    );
  }, [role, accessGroupOptions.length]);

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
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
        accessGroups={formik.values.accessGroups}
        onAccessGroupChange={(newAccessGroups) => {
          formik.setFieldValue("accessGroups", newAccessGroups);
        }}
      />

      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Save changes"
      />
    </Form>
  );
};

export default EditRoleForm;
