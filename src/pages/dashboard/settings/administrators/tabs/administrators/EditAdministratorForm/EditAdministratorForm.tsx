import { FC, useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "@canonical/react-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SelectOption } from "@/types/SelectOption";
import { Administrator } from "@/types/Administrator";
import useDebug from "@/hooks/useDebug";
import useAdministrators from "@/hooks/useAdministrators";
import useConfirm from "@/hooks/useConfirm";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import InfoItem from "@/components/layout/InfoItem";
import useRoles from "@/hooks/useRoles";
import useNotify from "@/hooks/useNotify";
import MultiSelectField from "@/components/form/MultiSelectField";

interface EditAdministratorFormProps {
  administrator: Administrator;
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
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { disableAdministratorQuery, editAdministratorQuery } =
    useAdministrators();
  const { getRolesQuery } = useRoles();

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

  const { mutateAsync: editAdministrator } = editAdministratorQuery;

  const { mutateAsync: disableAdministrator, isLoading: isDisabling } =
    disableAdministratorQuery;

  const handleDisableAdministrator = async () => {
    try {
      await disableAdministrator({ email: currentAdministrator.email });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleConfirmDisableAdministrator = () => {
    confirmModal({
      title: "Disable Administrator",
      body: "This will remove the administrator from your Landscape organization.",
      buttons: [
        <Button
          key="remove-administrator"
          onClick={handleDisableAdministrator}
          appearance="negative"
          hasIcon={true}
          aria-label={`Remove ${currentAdministrator.name}`}
        >
          {isDisabling && <Spinner />}
          Remove
        </Button>,
      ],
    });
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
      <Button type="button" hasIcon onClick={handleConfirmDisableAdministrator}>
        <i className="p-icon--delete" aria-hidden="true" />
        <span>Remove</span>
      </Button>

      <Row className="u-no-padding--left u-no-padding--right">
        <Col size={6}>
          <InfoItem label="Name" value={currentAdministrator.name} />
        </Col>
        <Col size={6}>
          <InfoItem label="Email" value={currentAdministrator.email} />
        </Col>
        <Col size={12}>
          <InfoItem label="Timezone" value={"---"} />
        </Col>
        <Col size={12}>
          <InfoItem label="Identity URL" value={"---"} />
        </Col>
      </Row>

      <MultiSelectField
        variant="condensed"
        label="Roles"
        items={roleOptions}
        selectedItems={roleOptions.filter(({ value }) =>
          formik.values.roles.includes(value),
        )}
        placeholder="Select roles"
        onItemsUpdate={(items) =>
          formik.setFieldValue(
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
