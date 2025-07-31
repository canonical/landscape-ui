import {
  useAcceptPendingInstances,
  useRejectPendingInstances,
} from "@/features/instances";
import useAuth from "@/hooks/useAuth";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import PendingInstanceList from "@/pages/dashboard/instances/PendingInstanceList";
import type { PendingInstance } from "@/types/Instance";
import type { SelectOption } from "@/types/SelectOption";
import { pluralize } from "@/utils/_helpers";
import {
  Button,
  ConfirmationButton,
  Select,
} from "@canonical/react-components";
import type { FC } from "react";
import { useState } from "react";
import { Link } from "react-router";
import classes from "./PendingInstancesForm.module.scss";

interface PendingInstanceListProps {
  readonly instances: PendingInstance[];
}

const PendingInstancesForm: FC<PendingInstanceListProps> = ({ instances }) => {
  const [isApproving, setIsApproving] = useState(false);
  const [accessGroup, setAccessGroup] = useState("");
  const [instanceIds, setInstanceIds] = useState<number[]>([]);

  const debug = useDebug();
  const { user } = useAuth();
  const { notify } = useNotify();
  const { closeSidePanel, changeSidePanelSize } = useSidePanel();
  const { getAccessGroupQuery } = useRoles();

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

  const { acceptPendingInstances, isAcceptingPendingInstances } =
    useAcceptPendingInstances();
  const { rejectPendingInstances, isRejectingPendingInstances } =
    useRejectPendingInstances();

  const handlePendingInstancesReject = async () => {
    try {
      await rejectPendingInstances({ computer_ids: instanceIds });

      closeSidePanel();

      notify.success({
        message: `${instanceIds.length} pending ${pluralize(instanceIds.length, "instance")} ${pluralize(instanceIds.length, "has", "have")} been rejected to add to your ${userOrganisation} organization.`,
        title: `You have rejected ${instanceIds.length} pending ${pluralize(instanceIds.length, "instance")}`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const handlePendingInstancesApprove = async () => {
    try {
      await acceptPendingInstances({
        access_group: accessGroup,
        computer_ids: instanceIds,
      });

      closeSidePanel();

      notify.success({
        message: `${instanceIds.length} pending ${pluralize(instanceIds.length, "instance")} ${pluralize(instanceIds.length, "has", "have")} been successfully added to your ${userOrganisation} organization.`,
        title: `You have approved ${instanceIds.length} pending ${pluralize(instanceIds.length, "instance")}`,
      });
    } catch (error) {
      debug(error);
    }
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
        <Link to="/settings/general">Org. settings</Link>
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
          onChange={(event) => {
            setAccessGroup(event.target.value);
          }}
        />
      )}

      {!isApproving && (
        <PendingInstanceList
          accessGroupOptions={accessGroupOptions}
          instances={instances}
          onSelectedIdsChange={(value) => {
            setInstanceIds(value);
          }}
          selectedIds={instanceIds}
        />
      )}

      <div className="form-buttons">
        <Button type="button" appearance="base" onClick={closeSidePanel}>
          Cancel
        </Button>
        {isApproving && (
          <>
            <Button type="button" onClick={handleBackClick}>
              Back
            </Button>
            <ConfirmationButton
              type="button"
              appearance="positive"
              disabled={instanceIds.length === 0}
              confirmationModalProps={{
                title: "Approve pending instances",
                children: (
                  <p>
                    This will approve {instanceIds.length} selected{" "}
                    {pluralize(instanceIds.length, "instance")} to add to your{" "}
                    {userOrganisation} organization.
                  </p>
                ),
                confirmButtonLabel: "Approve",
                confirmButtonAppearance: "positive",
                confirmButtonLoading: isAcceptingPendingInstances,
                confirmButtonDisabled: isAcceptingPendingInstances,
                onConfirm: handlePendingInstancesApprove,
              }}
            >
              Approve
            </ConfirmationButton>
          </>
        )}
        {!isApproving && (
          <>
            <ConfirmationButton
              type="button"
              appearance="negative"
              disabled={instanceIds.length === 0}
              confirmationModalProps={{
                title: "Reject pending instances",
                children: (
                  <p>
                    This will reject {instanceIds.length} selected{" "}
                    {pluralize(instanceIds.length, "instance")} to add to your{" "}
                    {userOrganisation} organization.
                  </p>
                ),
                confirmButtonLabel: "Reject",
                confirmButtonAppearance: "negative",
                confirmButtonLoading: isRejectingPendingInstances,
                confirmButtonDisabled: isRejectingPendingInstances,
                onConfirm: handlePendingInstancesReject,
              }}
            >
              Reject
            </ConfirmationButton>
            <Button
              type="button"
              appearance="positive"
              disabled={instanceIds.length === 0}
              onClick={handleApproving}
            >
              Approve
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default PendingInstancesForm;
