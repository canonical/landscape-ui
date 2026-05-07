import {
  Button,
  Icon,
  ICONS,
  Modal,
  ModularTable,
} from "@canonical/react-components";
import classNames from "classnames";
import { useMemo, type FC } from "react";
import classes from "./MirrorFilterHelpButton.module.scss";
import { useBoolean } from "usehooks-ts";
import type { Column } from "react-table";
import type { Term } from "./types";
import { PACKAGE_FILTER_HELP_DATA } from "./constants";
import { createPortal } from "react-dom";

const MirrorFilterHelpButton: FC = () => {
  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const columns = useMemo<Column<Term>[]>(
    () => [
      {
        Header: "Term",
        accessor: "term",
        className: classes.term,
      },
      {
        Header: "Description",
        accessor: "description",
      },
    ],
    [],
  );

  return (
    <>
      <Button
        type="button"
        appearance="base"
        hasIcon
        className={classNames("u-no-margin--bottom", classes.helpButton)}
        onClick={openModal}
        aria-label="Help"
      >
        <Icon name={ICONS.help} />
      </Button>
      {isModalOpen &&
        createPortal(
          <Modal
            title="Package query syntax"
            close={closeModal}
            className={classes.modal}
          >
            <p>
              Available search terms for use in package queries. If multiple
              terms are separated by <code>|</code> (OR), any of the conditions
              will match. Terms separated by <code>,</code> (AND) must all
              match. When a term is preceded by <code>!</code> (NOT), the
              condition must not match. Use parentheses <code>()</code> to group
              terms. Values containing spaces or ambiguous characters must be
              quoted with <code>&apos;</code> or <code>&quot;</code> (escape
              inner quotes with <code>\</code>).
            </p>
            <div className={classes.tableWrapper}>
              <ModularTable
                className="u-no-margin--bottom"
                columns={columns}
                data={PACKAGE_FILTER_HELP_DATA}
                style={{ minWidth: "60rem" }}
              />
            </div>
          </Modal>,
          document.body,
        )}
    </>
  );
};

export default MirrorFilterHelpButton;
