import { FC, isValidElement, useMemo } from "react";
import { Modal, ModularTable } from "@canonical/react-components";
import {
  CellProps,
  Column,
} from "@canonical/react-components/node_modules/@types/react-table";
import classes from "./SearchHelpPopup.module.scss";

interface SearchHelpPopupProps {
  open: boolean;
  onClose: () => void;
  data: Record<string, unknown>[];
}

const SearchHelpPopup: FC<SearchHelpPopupProps> = ({ open, onClose, data }) => {
  const columns: (Column<Record<string, unknown>> & { className?: string })[] =
    [
      {
        Header: "Term",
        accessor: "term",
        className: classes.term,
        Cell: ({ value }: CellProps<Record<string, unknown>, unknown>) =>
          "string" === typeof value ? <code>{value}</code> : null,
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ value }: CellProps<Record<string, unknown>, unknown>) =>
          "string" === typeof value || isValidElement(value) ? (
            <span className="u-text--muted">{value}</span>
          ) : null,
      },
    ];

  return (
    open && (
      <Modal title="Search help" close={onClose}>
        <p>
          Available search terms for use in the search box. If multiple search
          terms are separated by OR, any of the conditions will match.
          Otherwise, all conditions must be met for a instance to match. When a
          term is preceded by NOT, the condition must not match. If the searched
          value contains spaces or non-ASCII characters, it must be quoted.
        </p>
        <ModularTable
          className="u-no-margin--bottom"
          columns={useMemo(() => columns, [])}
          data={useMemo(() => data, [])}
        />
      </Modal>
    )
  );
};

export default SearchHelpPopup;
