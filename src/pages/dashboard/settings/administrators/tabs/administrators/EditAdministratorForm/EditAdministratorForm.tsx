import MultiSelectField from "@/components/form/MultiSelectField";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import InfoGrid from "@/components/layout/InfoGrid";
import useAdministrators from "@/hooks/useAdministrators";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import type { Administrator } from "@/types/Administrator";
import type { SelectOption } from "@/types/SelectOption";
import {
  ConfirmationButton,
  Form,
  Icon,
  ICONS,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useEffect, useState } from "react";
import * as Yup from "yup";

interface EditAdministratorFormProps {
  readonly administrator: Administrator;
}

const EditAdministratorForm: FC<EditAdministratorFormProps> = ({
  administrator,
}) => {
  const [currentAdministrator, setCurrentAdministrator] =
    useState(administrator);

  useEffect(() => {
    setCurrentAdministrator(administrator);
  }, [administrator]);

  const { notify } = useNotify();
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { disableAdministratorQuery, editAdministratorQuery } =
    useAdministrators();
  const { getRolesQuery } = useRoles();

  const { data: getRolesQueryResult } = getRolesQuery();

  const roleOptions: SelectOption[] =
    getRolesQueryResult?.data.map(({ name }) => ({
      label: name,
      value: name,
    })) ?? [];

  const { mutateAsync: editAdministrator } = editAdministratorQuery;

  const { mutateAsync: disableAdministrator, isPending: isDisabling } =
    disableAdministratorQuery;

  const handleDisableAdministrator = async () => {
    try {
      await disableAdministrator({ email: currentAdministrator.email });

      notify.success({
        title: "Administrator removed",
        message: `Administrator "${administrator.name}" has been removed successfully.`,
      });

      closeSidePanel();
    } catch (error) {
      debug(error);
    }
  };

  const handleSubmit = async (values: { roles: string[] }) => {
    try {
      await editAdministrator({ id: administrator.id, roles: values.roles });

      setCurrentAdministrator((prev) => ({ ...prev, roles: values.roles }));

      notify.success({
        title: "Permission changes have been queued",
        message: `You changed ${currentAdministrator.name}'s roles`,
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
    formik.setValues({ roles: currentAdministrator.roles });
  }, [currentAdministrator]);

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <ConfirmationButton
        type="button"
        className="has-icon"
        confirmationModalProps={{
          title: "Disable Administrator",
          children: (
            <p>
              This will remove the administrator from your Landscape
              organization.
            </p>
          ),
          confirmButtonLabel: "Remove",
          confirmButtonAppearance: "negative",
          confirmButtonDisabled: isDisabling,
          confirmButtonLoading: isDisabling,
          onConfirm: handleDisableAdministrator,
        }}
      >
        <Icon name={ICONS.delete} aria-hidden="true" />
        <span>Remove</span>
      </ConfirmationButton>

      <InfoGrid>
        <InfoGrid.Item label="Name" value={currentAdministrator.name} />
        <InfoGrid.Item label="Email" value={currentAdministrator.email} />

        <InfoGrid.Item label="Timezone" large value={null} />

        <InfoGrid.Item label="Identity URL" large value={null} />
      </InfoGrid>

      <MultiSelectField
        variant="condensed"
        label="Roles"
        items={roleOptions}
        selectedItems={roleOptions.filter(({ value }) =>
          formik.values.roles.includes(value),
        )}
        placeholder="Select roles"
        onItemsUpdate={async (items) =>
          await formik.setFieldValue(
            "roles",
            items.map(({ value }) => value as string),
          )
        }
        error={
          formik.touched.roles && typeof formik.errors.roles === "string"
            ? formik.errors.roles
            : undefined
        }
      />

      <SidePanelFormButtons
        submitButtonDisabled={
          formik.isSubmitting ||
          (formik.values.roles.length === currentAdministrator.roles.length &&
            formik.values.roles.every((role) =>
              currentAdministrator.roles.includes(role),
            ))
        }
        submitButtonText="Save changes"
      />
    </Form>
  );
};

export default EditAdministratorForm;
