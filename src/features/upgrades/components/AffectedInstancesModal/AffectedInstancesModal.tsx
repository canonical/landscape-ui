import { ModalTablePagination } from "@/components/layout/TablePagination";
import { DEFAULT_MODAL_PAGE_SIZE } from "@/constants";
import type { Package, PackageInstance } from "@/features/packages";
import { DEFAULT_CURRENT_PAGE } from "@/libs/pageParamsManager/constants";
import { Modal, ModularTable, SearchBox } from "@canonical/react-components";
import { useMemo, useState, type FC } from "react";
import type { CellProps, Column } from "react-table";
import { useCounter } from "usehooks-ts";

interface AffectedInstancesModalProps {
  readonly upgrade: Package;
  readonly onClose: () => void;
  readonly query?: string;
}

const AffectedInstancesModal: FC<AffectedInstancesModalProps> = ({
  upgrade,
  onClose,
}) => {
  const [, setSearch] = useState("");
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

  const columns = useMemo<Column<PackageInstance>[]>(
    () => [
      {
        Header: "Instance name",
        Cell: ({ row: { original: instance } }: CellProps<PackageInstance>) =>
          instance.name,
      },
      {
        Header: "Upgrade version",
        Cell: upgrade.version,
      },
    ],
    [upgrade.version],
  );

  return (
    <Modal title={`Instances upgradeable for ${upgrade.name}`} close={onClose}>
      <SearchBox
        externallyControlled
        onChange={setValue}
        onSearch={handleSearch}
        value={value}
      />
      <ModularTable columns={columns} data={[]} />
      <ModalTablePagination
        current={current}
        max={Math.ceil(0 / DEFAULT_MODAL_PAGE_SIZE)}
        onNext={next}
        onPrev={prev}
      />
    </Modal>
  );
};

export default AffectedInstancesModal;
