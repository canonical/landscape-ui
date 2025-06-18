import { useCloseTableFilterMenu } from "@/hooks/useCloseTableFilterMenu";
import { ContextualMenu } from "@canonical/react-components";
import type { FC } from "react";
import type { SingleFilterProps } from "../../types";
import commonClasses from "../../TableFilter.module.scss";
import { getToggleLabel } from "./helpers";
import { getCommonContextualMenuProps } from "../../helpers";
import { renderSingleBody } from "@/components/filter/TableFilter/components/helpers";

const TableFilterSingle: FC<SingleFilterProps> = (props) => {
  const {
    label,
    options,
    hasBadge,
    onSearch,
    selectedItem,
    inline = false,
    showSelectionOnToggleLabel = false,
  } = props;

  const { handleCloseMenu, rootRef } = useCloseTableFilterMenu();

  const toggleLabel = (
    <>
      <span>
        {getToggleLabel({
          label,
          options,
          otherProps: {
            showSelectionOnToggleLabel,
            selectedItem,
          },
        })}
      </span>
      {hasBadge && (
        <span className={commonClasses.badgeContainer}>
          {selectedItem && (
            <svg
              role="img"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="13" r="6" fill="#666666" />
            </svg>
          )}
        </span>
      )}
    </>
  );

  if (inline) {
    return renderSingleBody({ ...props });
  }

  return (
    <div ref={rootRef}>
      <ContextualMenu
        {...getCommonContextualMenuProps(onSearch)}
        toggleLabel={toggleLabel}
      >
        {renderSingleBody({ ...props, handleCloseMenu })}
      </ContextualMenu>
    </div>
  );
};

export default TableFilterSingle;
