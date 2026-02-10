import LoadingState from "@/components/layout/LoadingState";
import { ModalTablePagination } from "@/components/layout/TablePagination";
import { DEFAULT_MODAL_PAGE_SIZE } from "@/constants";
import type { PackageInstance } from "@/features/packages";
import { useGetPackageInstances } from "@/features/packages";
import { DEFAULT_CURRENT_PAGE } from "@/libs/pageParamsManager/constants";
import { Modal, ModularTable, SearchBox } from "@canonical/react-components";
import { useMemo, useState, type FC } from "react";
import type { CellProps, Column } from "react-table";
import { useCounter } from "usehooks-ts";
import type { PackageUpgrade } from "../../types/PackageUpgrade";

interface AffectedInstancesModalProps {
  readonly upgrade: PackageUpgrade;
  readonly onClose: () => void;
  readonly query?: string;
}

const AffectedInstancesModal: FC<AffectedInstancesModalProps> = ({
  upgrade,
  query,
  onClose,
}) => {
  const [search, setSearch] = useState("");
  const [value, setValue] = useState("");
  const {
    count: current,
    decrement: prev,
    increment: next,
    reset: resetCurrent,
  } = useCounter(DEFAULT_CURRENT_PAGE);

  const handleSearch = (inputValue: string) => {
    setSearch(inputValue);
    resetCurrent();
  };

  const {
    data: instancesResponse,
    isPending: isPendingInstances,
    error: instancesError,
  } = useGetPackageInstances({
    action: "upgrade",
    id: upgrade.id,
    query,
    search,
    selected_versions: [],
  });

  const columns = useMemo<Column<PackageInstance>[]>(
    () => [
      {
        Header: "Instance name",
        Cell: ({ row: { original: instance } }: CellProps<PackageInstance>) =>
          instance.name,
      },
      {
        Header: "Current version",
        Cell: upgrade.versions.current,
      },
      {
        Header: "New version",
        Cell: upgrade.versions.newest,
      },
    ],
    [upgrade.versions.current, upgrade.versions.newest, upgrade.versions],
  );

  if (instancesError) {
    throw instancesError;
  }

  return (
    <Modal title={`Instances upgradeable for [package_name]`} close={onClose}>
      <SearchBox
        externallyControlled
        onChange={setValue}
        onSearch={handleSearch}
        value={value}
      />
      {isPendingInstances ? (
        <LoadingState />
      ) : (
        <>
          <ModularTable
            columns={columns}
            data={instancesResponse.data.results}
          />
          <ModalTablePagination
            current={current}
            max={Math.ceil(
              instancesResponse.data.count / DEFAULT_MODAL_PAGE_SIZE,
            )}
            onNext={next}
            onPrev={prev}
          />
        </>
      )}
    </Modal>
  );
};

export default AffectedInstancesModal;
