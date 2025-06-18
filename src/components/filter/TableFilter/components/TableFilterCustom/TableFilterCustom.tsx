import type { FC } from "react";
import type { CustomFilterProps } from "../../types";
import { useCloseTableFilterMenu } from "@/hooks/useCloseTableFilterMenu";
import { ContextualMenu } from "@canonical/react-components";
import { getCommonContextualMenuProps } from "../../helpers";
import { renderCustomBody } from "@/components/filter/TableFilter/components/helpers";

const TableFilterCustom: FC<CustomFilterProps> = (props) => {
  const { rootRef, handleCloseMenu } = useCloseTableFilterMenu();
  const { label } = props;

  if (props.inline) {
    return renderCustomBody({ ...props });
  }

  return (
    <div ref={rootRef}>
      <ContextualMenu {...getCommonContextualMenuProps()} toggleLabel={label}>
        {renderCustomBody({ ...props, handleCloseMenu })}
      </ContextualMenu>
    </div>
  );
};

export default TableFilterCustom;
