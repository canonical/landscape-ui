import { useFormik } from "formik";
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Select } from "@canonical/react-components";
import { ROOT_PATH } from "@/constants";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import PendingInstanceList from "@/pages/dashboard/instances/PendingInstanceList";
import { PendingInstance } from "@/types/Instance";
import { SelectOption } from "@/types/SelectOption";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import { PendingInstancesFormProps } from "./types";
import classes from "./PendingInstancesForm.module.scss";
import useAuth from "@/hooks/useAuth";

interface PendingInstanceListProps {
  instances: PendingInstance[];
}

const PendingInstancesForm: FC<PendingInstanceListProps> = ({ instances }) => {
  const [isApproving, setIsApproving] = useState(false);

  const debug = useDebug();
  const { user } = useAuth();
  const { notify } = useNotify();
  const { closeSidePanel, changeSidePanelSize } = useSidePanel();
  const { closeConfirmModal, confirmModal } = useConfirm();
  const { getAccessGroupQuery } = useRoles();
  const { acceptPendingInstancesQuery, rejectPendingInstancesQuery } =
    useInstances();

  const handleApproving = () => {
    setIsApproving(true);
    changeSidePanelSize("small");
  };

  const handleBackClick = () => {
    setIsApproving(false);
    changeSidePanelSize("large");
  };

  const { mutateAsync: acceptPendingInstances } = acceptPendingInstancesQuery;
  const { mutateAsync: rejectPendingInstances } = rejectPendingInstancesQuery;

  const handleRejectPendingInstances = async (computer_ids: number[]) => {
    try {
      await rejectPendingInstances({ computer_ids });

      closeConfirmModal();
      closeSidePanel();

      notify.success({
        message: `${computer_ids.length} pending ${computer_ids.length > 1 ? "instances" : "instance"} have been rejected to add to your ${user?.current_account} organisation.`,
        title: `You have rejected ${computer_ids.length} pending ${computer_ids.length > 1 ? "instances" : "instance"}`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleRejectPendingInstancesDialog = (computer_ids: number[]) => {
    confirmModal({
      title: "Reject pending instances",
      body: `This will reject ${computer_ids.length} selected ${computer_ids.length > 1 ? "instances" : "instance"} to add to your ${user?.current_account} organisation.`,
      buttons: [
        <Button
          key="reject"
          type="button"
          appearance="negative"
          onClick={() => handleRejectPendingInstances(computer_ids)}
          aria-label={`Reject selected ${computer_ids.length > 1 ? "instances" : "instance"}`}
        >
          Reject
        </Button>,
      ],
    });
  };

  const handleSubmit = async (values: PendingInstancesFormProps) => {
    try {
      await acceptPendingInstances(values);

      notify.success({
        message: `${values.computer_ids.length} pending ${values.computer_ids.length > 1 ? "instances" : "instance"} have been successfully added to your ${user?.current_account} organisation.`,
        title: `You have approved ${values.computer_ids.length} pending ${values.computer_ids.length > 1 ? "instances" : "instance"}`,
      });

      closeSidePanel();
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: handleSubmit,
    validationSchema: VALIDATION_SCHEMA,
  });

  const { data: getAccessGroupQueryResult, error: getAccessGroupQueryError } =
    getAccessGroupQuery();

  if (getAccessGroupQueryError) {
    debug(getAccessGroupQueryError);
  }

  const accessGroupOptions: SelectOption[] =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <p className={classes.help}>
        <span>
          You can automatically register new Landscape Client Instances when
          they’re configured using a registration key. This eliminates the need
          for manual approval of each computer. You can enable this feature in
          the{" "}
        </span>
        <Link to={`${ROOT_PATH}settings/general`}>Org. settings</Link>
        <span> or </span>
        <a
          href="https://ubuntu.com/landscape/docs/managing-computers"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          learn more
        </a>
      </p>

      {isApproving && (
        <Select
          label="Access group"
          options={accessGroupOptions}
          {...formik.getFieldProps("access_group")}
          error={
            formik.touched.access_group && formik.errors.access_group
              ? formik.errors.access_group
              : undefined
          }
        />
      )}

      {!isApproving && (
        <PendingInstanceList
          accessGroupOptions={accessGroupOptions}
          instances={instances}
          onSelectedIdsChange={(value) =>
            formik.setFieldValue("computer_ids", value)
          }
          selectedIds={formik.values.computer_ids}
        />
      )}

      <div className="form-buttons">
        <Button type="button" appearance="base" onClick={closeSidePanel}>
          Cancel
        </Button>
        {isApproving ? (
          <Button type="button" onClick={handleBackClick}>
            Back
          </Button>
        ) : (
          <Button
            type="button"
            appearance="negative"
            disabled={formik.values.computer_ids.length === 0}
            onClick={() =>
              handleRejectPendingInstancesDialog(formik.values.computer_ids)
            }
          >
            Reject
          </Button>
        )}
        <Button
          type="button"
          appearance="positive"
          disabled={formik.values.computer_ids.length === 0}
          onClick={isApproving ? formik.submitForm : handleApproving}
        >
          Approve
        </Button>
      </div>
    </Form>
  );
};

export default PendingInstancesForm;
