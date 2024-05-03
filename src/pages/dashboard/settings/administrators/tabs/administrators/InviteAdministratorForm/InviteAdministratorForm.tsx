import { useFormik } from "formik";
import { FC } from "react";
import { Form, Input } from "@canonical/react-components";
import MultiSelectField from "@/components/form/MultiSelectField";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useAdministrators from "@/hooks/useAdministrators";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import { SelectOption } from "@/types/SelectOption";
import { getValidationSchema } from "./helpers";

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

const InviteAdministratorForm: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { getInvitationsQuery, inviteAdministratorQuery } = useAdministrators();
  const { getRolesQuery } = useRoles();
  const { closeSidePanel } = useSidePanel();

  const { data: getInvitationsQueryResult } = getInvitationsQuery();

  const { mutateAsync: inviteAdministrator } = inviteAdministratorQuery;

  const handleSubmit = async (values: FormProps) => {
    try {
      await inviteAdministrator(values);

      closeSidePanel();
      notify.success({
        title: "You sent an administrator invite",
        message: `${values.name} will receive an invitation email`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema: getValidationSchema(
      getInvitationsQueryResult?.data.results ?? [],
    ),
    onSubmit: handleSubmit,
  });

  const { data: getRolesQueryResult } = getRolesQuery();

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
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Send invite"
      />
    </Form>
  );
};

export default InviteAdministratorForm;
