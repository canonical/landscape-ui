import type { FC } from "react";
import type { CustomFilterProps } from "../../types";
import { useCloseTableFilterMenu } from "@/hooks/useCloseTableFilterMenu";
import { ContextualMenu } from "@canonical/react-components";
import { getCommonContextualMenuProps } from "../../helpers";
import classes from "./TableFilterCustom.module.scss";

const TableFilterCustom: FC<CustomFilterProps> = (props) => {
  const { rootRef, handleCloseMenu } = useCloseTableFilterMenu();
  const { customComponent: CustomFilter, label } = props;

  return (
    <div ref={rootRef}>
      <ContextualMenu {...getCommonContextualMenuProps()} toggleLabel={label}>
        <div className={classes.container}>
          <CustomFilter closeMenu={handleCloseMenu} />
        </div>
      </ContextualMenu>
    </div>
  );
};

export default TableFilterCustom;
