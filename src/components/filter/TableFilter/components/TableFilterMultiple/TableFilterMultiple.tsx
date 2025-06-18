import { Badge, ContextualMenu } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import commonClasses from "../../TableFilter.module.scss";
import type { MultipleFilterProps } from "../../types";
import { getCommonContextualMenuProps } from "../../helpers";
import { renderMultipleBody } from "@/components/filter/TableFilter/components/helpers";

const TableFilterMultiple: FC<MultipleFilterProps> = (props) => {
  const {
    label,
    options,
    hasBadge,
    onSearch,
    selectedItems,
    inline = false,
  } = props;

  const toggleLabel = (
    <>
      <span>{label}</span>
      {hasBadge && (
        <span
          className={classNames(commonClasses.badgeContainer, {
            [commonClasses.multiple]: options.length > 9,
          })}
        >
          {selectedItems.length > 0 && (
            <Badge
              value={selectedItems.length}
              className={commonClasses.badge}
            />
          )}
        </span>
      )}
    </>
  );

  if (inline) {
    return renderMultipleBody(props);
  }

  return (
    <ContextualMenu
      {...getCommonContextualMenuProps(onSearch)}
      toggleLabel={toggleLabel}
    >
      {renderMultipleBody(props)}
    </ContextualMenu>
  );
};

export default TableFilterMultiple;
