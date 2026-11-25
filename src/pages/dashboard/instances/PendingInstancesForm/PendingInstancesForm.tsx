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
import { ConfirmationModal, Select } from "@canonical/react-components";
import { Button } from "@canonical/react-ds-global";
import type { FC } from "react";
import { useState } from "react";
import { Link } from "react-router";
import classes from "./PendingInstancesForm.module.scss";
import { ROUTES } from "@/libs/routes";
import { AUTO_REGISTER_NEW_COMPUTERS_DOCUMENTATION_URL } from "./constants";
import { DEFAULT_ACCESS_GROUP_NAME } from "@/constants";

interface PendingInstanceListProps {
  readonly instances: PendingInstance[];
}

const PendingInstancesForm: FC<PendingInstanceListProps> = ({ instances }) => {
  const [isApproving, setIsApproving] = useState(false);
  const [accessGroup, setAccessGroup] = useState(DEFAULT_ACCESS_GROUP_NAME);
  const [instanceIds, setInstanceIds] = useState<number[]>([]);
  const [activeModal, setActiveModal] = useState<"approve" | "reject" | null>(
    null,
  );

  const closeModal = () => {
    setActiveModal(null);
  };

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
        message: `${pluralize(instanceIds.length, ["pending instance has", "pending instances have"], "exact")} been rejected to add to your ${userOrganisation} organization.`,
        title: `You have rejected ${pluralize(instanceIds.length, ["pending instance"], "exact")}`,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeModal();
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
        message: `${pluralize(instanceIds.length, ["pending instance has", "pending instances have"], "exact")} been successfully added to your ${userOrganisation} organization.`,
        title: `You have approved ${pluralize(instanceIds.length, ["pending instance"], "exact")}`,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeModal();
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
        <Link to={ROUTES.settings.general()}>Org. settings</Link>
        <span> or </span>
        <a
          href={AUTO_REGISTER_NEW_COMPUTERS_DOCUMENTATION_URL}
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

      <div className={classes.formButtons}>
        <Button type="button" importance="tertiary" onClick={closeSidePanel}>
          Cancel
        </Button>
        {isApproving && (
          <>
            <Button
              type="button"
              importance="secondary"
              onClick={handleBackClick}
            >
              Back
            </Button>
            <Button
              type="button"
              importance="primary"
              disabled={instanceIds.length === 0}
              onClick={() => {
                setActiveModal("approve");
              }}
            >
              Approve
            </Button>
          </>
        )}
        {!isApproving && (
          <>
            <Button
              type="button"
              importance="secondary"
              anticipation="destructive"
              disabled={instanceIds.length === 0}
              onClick={() => {
                setActiveModal("reject");
              }}
            >
              Reject
            </Button>
            <Button
              type="button"
              importance="primary"
              disabled={instanceIds.length === 0}
              onClick={handleApproving}
            >
              Approve
            </Button>
          </>
        )}
      </div>
      {activeModal === "approve" && (
        <ConfirmationModal
          renderInPortal
          title="Approve pending instances"
          confirmButtonLabel="Approve"
          confirmButtonAppearance="positive"
          confirmButtonLoading={isAcceptingPendingInstances}
          confirmButtonDisabled={isAcceptingPendingInstances}
          onConfirm={handlePendingInstancesApprove}
          close={closeModal}
        >
          <p className="u-margin--bottom">
            This will approve{" "}
            {pluralize(instanceIds.length, ["selected instance"], "exact")} to
            add to your {userOrganisation} organization.
          </p>
        </ConfirmationModal>
      )}
      {activeModal === "reject" && (
        <ConfirmationModal
          renderInPortal
          title="Reject pending instances"
          confirmButtonLabel="Reject"
          confirmButtonAppearance="negative"
          confirmButtonLoading={isRejectingPendingInstances}
          confirmButtonDisabled={isRejectingPendingInstances}
          onConfirm={handlePendingInstancesReject}
          close={closeModal}
        >
          <p className="u-margin--bottom">
            This will reject{" "}
            {pluralize(instanceIds.length, ["selected instance"], "exact")} to
            add to your {userOrganisation} organization.
          </p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default PendingInstancesForm;
