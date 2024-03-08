import { FC } from "react";
import { Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import useDebug from "@/hooks/useDebug";
import useAdministrators from "@/hooks/useAdministrators";
import useRoles from "@/hooks/useRoles";
import { SelectOption } from "@/types/SelectOption";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useNotify from "@/hooks/useNotify";
import MultiSelectField from "@/components/form/MultiSelectField";

interface FormProps {
  email: string;
  name: string;
  roles: string[];
}

const INITIAL_VALUES: FormProps = {
  email: "",
  name: "",
  roles: [],
};

const VALIDATION_SCHEMA = Yup.object().shape({
  email: Yup.string()
    .email("Please provide a valid email address")
    .required("This field is required."),
  name: Yup.string().required("This field is required."),
  roles: Yup.array().of(Yup.string()),
});

const InviteAdministratorForm: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { inviteAdministratorQuery } = useAdministrators();
  const { getRolesQuery } = useRoles();

  const { mutateAsync: inviteAdministrator } = inviteAdministratorQuery;

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      try {
        await inviteAdministrator(values);

        notify.success({
          title: "You sent an administrator invite",
          message: `${values.name} will receive an invitation email`,
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  const { data: getRolesQueryResult, error: getRolesQueryError } =
    getRolesQuery();

  if (getRolesQueryError) {
    debug(getRolesQueryError);
  }

  const roleOptions: SelectOption[] =
    getRolesQueryResult?.data.map(({ name }) => ({
      label: name,
      value: name,
    })) ?? [];

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <p>
        An invitation, sent by email, contains a link a prospective
        administrator can use to join this account.
      </p>

      <Input
        type="text"
        label="Name"
        autoComplete="off"
        required
        {...formik.getFieldProps("name")}
        error={
          formik.touched.name && formik.errors.name
            ? formik.errors.name
            : undefined
        }
      />

      <Input
        type="email"
        label="Email address"
        autoComplete="off"
        required
        {...formik.getFieldProps("email")}
        error={
          formik.touched.email && formik.errors.email
            ? formik.errors.email
            : undefined
        }
      />

      <MultiSelectField
        variant="condensed"
        label="Roles"
        items={roleOptions}
        selectedItems={roleOptions.filter(({ value }) =>
          formik.values.roles.includes(value),
        )}
        onItemsUpdate={(items) =>
          formik.setFieldValue(
            "roles",
            items.map(({ value }) => value as string),
          )
        }
      />

      <SidePanelFormButtons
        disabled={formik.isSubmitting}
        submitButtonText="Send invite"
      />
    </Form>
  );
};

export default InviteAdministratorForm;
