import { FC, useEffect } from "react";
import { Button, Form } from "@canonical/react-components";
import MultiSelectField from "@/components/form/MultiSelectField";
import useAdministrators from "@/hooks/useAdministrators";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { Administrator } from "@/types/Administrator";
import { SelectOption } from "@/types/SelectOption";
import classes from "./AdministratorRolesCell.module.scss";
import { useFormik } from "formik";
import * as Yup from "yup";

interface AdministratorRolesCellProps {
  administrator: Administrator;
  roleOptions: SelectOption[];
}

const AdministratorRolesCell: FC<AdministratorRolesCellProps> = ({
  administrator,
  roleOptions,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { editAdministratorQuery } = useAdministrators();

  const { mutateAsync: editAdministrator } = editAdministratorQuery;

  const handleSubmit = async ({ roles }: { roles: string[] }) => {
    try {
      await editAdministrator({ id: administrator.id, roles });

      notify.success({
        title: "Permission changes have been queued",
        message: `You changed ${administrator.name}'s roles`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: { roles: [] as string[] },
    validationSchema: Yup.object().shape({
      roles: Yup.array()
        .of(Yup.string())
        .min(1, "At least one role is required"),
    }),
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    formik.setValues({ roles: administrator.roles });
  }, [administrator.roles]);

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <MultiSelectField
        required
        variant="condensed"
        className={classes.multiSelect}
        items={roleOptions}
        selectedItems={roleOptions.filter(({ value }) =>
          formik.values.roles.includes(value),
        )}
        onItemsUpdate={(items) =>
          formik.setValues({
            roles: items.map(({ value }) => value as string),
          })
        }
        placeholder="Select roles"
        error={
          formik.touched.roles && typeof formik.errors.roles === "string"
            ? formik.errors.roles
            : undefined
        }
        dropdownFooter={
          <div className={classes.footer}>
            <Button
              type="submit"
              dense
              small
              appearance="positive"
              className="u-no-margin--bottom"
              disabled={
                formik.values.roles.length === administrator.roles.length &&
                administrator.roles.every((role) =>
                  formik.values.roles.includes(role),
                )
              }
            >
              Save changes
            </Button>
            <Button
              type="button"
              dense
              small
              className="u-no-margin--bottom"
              disabled={
                formik.values.roles.length === administrator.roles.length &&
                administrator.roles.every((role) =>
                  formik.values.roles.includes(role),
                )
              }
              onClick={() => formik.setFieldValue("roles", administrator.roles)}
            >
              Revert
            </Button>
          </div>
        }
      />
    </Form>
  );
};

export default AdministratorRolesCell;
