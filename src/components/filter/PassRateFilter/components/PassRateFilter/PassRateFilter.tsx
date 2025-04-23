import tableFilterClasses from "@/components/filter/TableFilter/TableFilter.module.scss";
import { ContextualMenu } from "@canonical/react-components";
import { useState } from "react";
import PassRateFilterBase from "../PassRateFilterBase";

const PassRateFilter = () => {
  const [visible, setVisible] = useState(false);

  const toggleMenu = () => {
    setVisible((v) => !v);
  };

  const hideMenu = () => {
    setVisible(false);
  };

  return (
    <ContextualMenu
      visible={visible}
      autoAdjust={true}
      toggleAppearance="base"
      toggleLabel={
        <>
          <span>Pass rate</span>
        </>
      }
      toggleClassName={tableFilterClasses.toggle}
      toggleProps={{
        onClick: toggleMenu,
      }}
      hasToggleIcon={true}
      dropdownClassName={tableFilterClasses.dropdown}
      position="left"
    >
      <PassRateFilterBase hideMenu={hideMenu} />
    </ContextualMenu>
  );
};

export default PassRateFilter;
