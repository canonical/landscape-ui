import { FC, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Column } from "react-table";
import { Button, Icon } from "@canonical/react-components";
import ExpandableTable from "@/components/layout/ExpandableTable";
import LoadingState from "@/components/layout/LoadingState";
import { ROOT_PATH } from "@/constants";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useUsns from "@/hooks/useUsns";
import { UsnPackage } from "@/types/Usn";
import { Instance } from "@/types/Instance";

type UsnPackageListProps = {
  limit: number;
  onLimitChange: () => void;
  usn: string;
} & (
  | {
      isRemovable: true;
      instance: Instance;
    }
  | {
      isRemovable: false;
      instanceIds: number[];
    }
);

const UsnPackageList: FC<UsnPackageListProps> = ({
  limit,
  onLimitChange,
  usn,
  ...otherProps
}) => {
  const navigate = useNavigate();
  const debug = useDebug();
  const { notify } = useNotify();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { getAffectedPackagesQuery, removeUsnPackagesQuery } = useUsns();

  const { mutateAsync: removeUsnPackages } = removeUsnPackagesQuery;

  const handleActivityDetailsView = (instance: Instance) => {
    navigate(
      `${ROOT_PATH}instances/${instance.parent ? `${instance.parent.id}/${instance.id}` : instance.id}`,
      { state: { tab: "activities" } },
    );

    notify.clear();
  };

  const handleRemoveUsnPackages = async (instance: Instance) => {
    try {
      await removeUsnPackages({
        usns: usn,
        instanceId: instance.id,
      });

      notify.success({
        title: "You queued packages to be uninstalled",
        message: `Packages affected by "${usn}" security issue will be uninstalled and are queued in Activities.`,
        actions: [
          {
            label: "View details",
            onClick: () => handleActivityDetailsView(instance),
          },
        ],
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleRemoveUsnPackagesDialog = (instance: Instance) => {
    confirmModal({
      title: "Uninstall USN packages",
      body: `This will uninstall packages affected by "${usn}" security issue from the "${instance.title}" instance.`,
      buttons: [
        <Button
          key="remove"
          type="button"
          appearance="negative"
          onClick={() => handleRemoveUsnPackages(instance)}
        >
          Uninstall
        </Button>,
      ],
    });
  };

  const additionalCta = otherProps.isRemovable
    ? [
        <Button
          key="remove"
          type="button"
          small
          dense
          hasIcon
          onClick={() => handleRemoveUsnPackagesDialog(otherProps.instance)}
        >
          <Icon name="delete" className="u-no-margin--left" />
          <span>Uninstall packages</span>
        </Button>,
      ]
    : undefined;

  const {
    data: getAffectedPackagesQueryResult,
    error: getAffectedPackagesQueryError,
    isLoading: getAffectedPackagesQueryLoading,
  } = getAffectedPackagesQuery({
    usn,
    computer_ids: otherProps.isRemovable
      ? [otherProps.instance.id]
      : otherProps.instanceIds,
  });

  if (getAffectedPackagesQueryError) {
    debug(getAffectedPackagesQueryError);
  }

  const packageSlice = useMemo(
    () => getAffectedPackagesQueryResult?.data.slice(0, limit) || [],
    [getAffectedPackagesQueryResult, limit],
  );

  const columns = useMemo<Column<UsnPackage>[]>(
    () => [
      {
        accessor: "name",
        Header: "Package",
      },
      {
        accessor: "current_version",
        Header: "Current version",
      },
      {
        accessor: "new_version",
        Header: "New version",
      },
      {
        accessor: "summary",
        Header: "Details",
      },
    ],
    [packageSlice.length],
  );

  return getAffectedPackagesQueryLoading ? (
    <LoadingState />
  ) : (
    <ExpandableTable
      additionalCta={additionalCta}
      columns={columns}
      data={packageSlice}
      itemNames={{ plural: "packages", singular: "package" }}
      limit={limit}
      onLimitChange={onLimitChange}
      totalCount={getAffectedPackagesQueryResult?.data.length ?? 0}
    />
  );
};

export default UsnPackageList;
