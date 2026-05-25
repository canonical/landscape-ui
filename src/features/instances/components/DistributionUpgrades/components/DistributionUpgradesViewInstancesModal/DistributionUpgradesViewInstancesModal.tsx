import { Modal, ModularTable } from "@canonical/react-components";
import { useMemo } from "react";
import type { FC } from "react";
import type { Column } from "react-table";
import { useCounter } from "usehooks-ts";
import { ModalTablePagination } from "@/components/layout/TablePagination";
import { DEFAULT_MODAL_PAGE_SIZE } from "@/constants";
import type { InstanceModalRow } from "../../types";
import type { DistributionCategory } from "./types";
import { getModalTitle } from "./helpers";
import { createPortal } from "react-dom";

interface DistributionUpgradesViewInstancesModalProps {
  readonly category: DistributionCategory;
  readonly onClose: () => void;
}

const DistributionUpgradesViewInstancesModal: FC<
  DistributionUpgradesViewInstancesModalProps
> = ({ category, onClose }) => {
  const {
    count: currentPage,
    decrement: decrementCurrentPage,
    increment: incrementCurrentPage,
  } = useCounter(1);

  const currentInstancesForModal = useMemo(() => {
    const start = (currentPage - 1) * DEFAULT_MODAL_PAGE_SIZE;
    return category.instances.slice(start, start + DEFAULT_MODAL_PAGE_SIZE);
  }, [category, currentPage]);

  const columns = useMemo<Column<InstanceModalRow>[]>(
    () => [
      { Header: "INSTANCE NAME", accessor: "instanceTitle" },
      { Header: "CURRENT DISTRIBUTION", accessor: "currentDistribution" },
      {
        Header: category.isIneligibleCategory
          ? "REASON"
          : "TARGET DISTRIBUTION",
        accessor: category.isIneligibleCategory
          ? "reason"
          : "targetDistribution",
      },
    ],
    [category.isIneligibleCategory],
  );

  const modalTitle = getModalTitle(category);

  return createPortal(
    <Modal close={onClose} title={modalTitle}>
      <ModularTable
        className="u-no-margin--bottom"
        columns={columns}
        data={currentInstancesForModal}
      />
      {category.instances.length > DEFAULT_MODAL_PAGE_SIZE && (
        <ModalTablePagination
          max={Math.ceil(category.instances.length / DEFAULT_MODAL_PAGE_SIZE)}
          current={currentPage}
          onPrev={decrementCurrentPage}
          onNext={incrementCurrentPage}
        />
      )}
    </Modal>,
    document.body,
  );
};

export default DistributionUpgradesViewInstancesModal;
