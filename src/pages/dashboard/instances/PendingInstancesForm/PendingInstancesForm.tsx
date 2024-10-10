import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Select } from "@canonical/react-components";
import { ROOT_PATH } from "@/constants";
import useAuth from "@/hooks/useAuth";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import PendingInstanceList from "@/pages/dashboard/instances/PendingInstanceList";
import { PendingInstance } from "@/types/Instance";
import { SelectOption } from "@/types/SelectOption";
import classes from "./PendingInstancesForm.module.scss";

interface PendingInstanceListProps {
  instances: PendingInstance[];
}

const PendingInstancesForm: FC<PendingInstanceListProps> = ({ instances }) => {
  const [isApproving, setIsApproving] = useState(false);
  const [accessGroup, setAccessGroup] = useState("");
  const [instanceIds, setInstanceIds] = useState<number[]>([]);

  const debug = useDebug();
  const { user } = useAuth();
  const { notify } = useNotify();
  const { closeSidePanel, changeSidePanelSize } = useSidePanel();
  const { closeConfirmModal, confirmModal } = useConfirm();
  const { getAccessGroupQuery } = useRoles();
  const { acceptPendingInstancesQuery, rejectPendingInstancesQuery } =
    useInstances();

  const userOrganisation = user?.accounts.find(
    (account) => account.name === user?.current_account,
  )?.title;

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

  const handlePendingInstancesReject = async () => {
    try {
      await rejectPendingInstances({ computer_ids: instanceIds });

      closeSidePanel();

      notify.success({
        message: `${instanceIds.length} pending ${instanceIds.length === 1 ? "instance" : "instances"} have been rejected to add to your ${userOrganisation} organisation.`,
        title: `You have rejected ${instanceIds.length} pending ${instanceIds.length === 1 ? "instance" : "instances"}`,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handlePendingInstancesDialogReject = () => {
    confirmModal({
      title: "Reject pending instances",
      body: `This will reject ${instanceIds.length} selected ${instanceIds.length === 1 ? "instance" : "instances"} to add to your ${userOrganisation} organisation.`,
      buttons: [
        <Button
          key="reject"
          type="button"
          appearance="negative"
          onClick={handlePendingInstancesReject}
          aria-label={`Reject selected ${instanceIds.length === 1 ? "instance" : "instances"}`}
        >
          Reject
        </Button>,
      ],
    });
  };

  const handlePendingInstancesApprove = async () => {
    try {
      await acceptPendingInstances({
        access_group: accessGroup,
        computer_ids: instanceIds,
      });

      closeSidePanel();

      notify.success({
        message: `${instanceIds.length} pending ${instanceIds.length === 1 ? "instance" : "instances"} have been successfully added to your ${userOrganisation} organisation.`,
        title: `You have approved ${instanceIds.length} pending ${instanceIds.length === 1 ? "instance" : "instances"}`,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handlePendingInstancesApproveDialog = () => {
    confirmModal({
      title: "Approve pending instances",
      body: `This will approve ${instanceIds.length} selected ${instanceIds.length === 1 ? "instance" : "instances"} to add to your ${userOrganisation} organisation.`,
      buttons: [
        <Button
          key="approve"
          type="button"
          appearance="positive"
          onClick={handlePendingInstancesApprove}
          aria-label={`Approve selected ${instanceIds.length === 1 ? "instance" : "instances"}`}
        >
          Approve
        </Button>,
      ],
    });
  };

  const { data: getAccessGroupQueryResult } = getAccessGroupQuery();

  const accessGroupOptions: SelectOption[] =
    getAccessGroupQueryResult?.data.map(({ name, title }) => ({
      label: title,
      value: name,
    })) ?? [];

  return (
    <>
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
          name="access_group"
          value={accessGroup}
          onChange={(event) => setAccessGroup(event.target.value)}
        />
      )}

      {!isApproving && (
        <PendingInstanceList
          accessGroupOptions={accessGroupOptions}
          instances={instances}
          onSelectedIdsChange={(value) => setInstanceIds(value)}
          selectedIds={instanceIds}
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
            disabled={instanceIds.length === 0}
            onClick={handlePendingInstancesDialogReject}
          >
            Reject
          </Button>
        )}
        <Button
          type="button"
          appearance="positive"
          disabled={instanceIds.length === 0}
          onClick={
            isApproving ? handlePendingInstancesApproveDialog : handleApproving
          }
        >
          Approve
        </Button>
      </div>
    </>
  );
};

export default PendingInstancesForm;
