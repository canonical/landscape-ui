import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { usePageParams } from "@/hooks/usePageParams";

type UsnPackageListProps = {
  limit: number;
  onLimitChange: () => void;
  usn: string;
} & (
  | {
      isRemovable: true;
      instanceTitle: string;
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
  const { setPageParams } = usePageParams();
  const { instanceId: urlInstanceId, childInstanceId } = useParams();

  const instanceId = Number(urlInstanceId);
  const { mutateAsync: removeUsnPackages } = removeUsnPackagesQuery;

  const handleActivityDetailsView = () => {
    navigate(
      `${ROOT_PATH}instances/${childInstanceId ? `${instanceId}/${childInstanceId}` : `${instanceId}`}`,
    );
    setPageParams({ tab: "activities" });
    notify.clear();
  };

  const handleRemoveUsnPackages = async () => {
    try {
      await removeUsnPackages({
        usns: usn,
        instanceId: instanceId,
      });

      notify.success({
        title: "You queued packages to be uninstalled",
        message: `Packages affected by "${usn}" security issue will be uninstalled and are queued in Activities.`,
        actions: [
          {
            label: "View details",
            onClick: () => handleActivityDetailsView(),
          },
        ],
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleRemoveUsnPackagesDialog = (instanceTitle: string) => {
    confirmModal({
      title: "Uninstall USN packages",
      body: `This will uninstall packages affected by "${usn}" security issue from the "${instanceTitle}" instance.`,
      buttons: [
        <Button
          key="remove"
          type="button"
          appearance="negative"
          onClick={() => handleRemoveUsnPackages()}
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
          onClick={() =>
            handleRemoveUsnPackagesDialog(otherProps.instanceTitle)
          }
        >
          <Icon name="delete" className="u-no-margin--left" />
          <span>Uninstall packages</span>
        </Button>,
      ]
    : undefined;

  const {
    data: getAffectedPackagesQueryResult,
    isLoading: getAffectedPackagesQueryLoading,
  } = getAffectedPackagesQuery({
    usn,
    computer_ids: otherProps.isRemovable
      ? [instanceId]
      : otherProps.instanceIds,
  });

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
