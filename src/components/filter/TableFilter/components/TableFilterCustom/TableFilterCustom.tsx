import { useCloseTableFilterMenu } from "@/hooks/useCloseTableFilterMenu";
import { ContextualMenu } from "@canonical/react-components";
import type { FC } from "react";
import { getCommonContextualMenuProps } from "../../helpers";
import type { CustomFilterProps } from "../../types";
import classes from "./TableFilterCustom.module.scss";

const TableFilterCustom: FC<CustomFilterProps> = ({
  customComponent: CustomFilter,
  label,
  inline,
}) => {
  const { rootRef, handleCloseMenu } = useCloseTableFilterMenu();

  const body = (
    <div className={classes.container}>
      <CustomFilter closeMenu={handleCloseMenu} />
    </div>
  );

  if (inline) {
    return body;
  }

  return (
    <div ref={rootRef}>
      <ContextualMenu {...getCommonContextualMenuProps()} toggleLabel={label}>
        {body}
      </ContextualMenu>
    </div>
  );
};

export default TableFilterCustom;
