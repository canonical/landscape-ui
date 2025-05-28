import tableFilterClasses from "@/components/filter/TableFilter/TableFilter.module.scss";
import { Badge } from "@canonical/react-components";
import PassRateFilterBase from "../PassRateFilterBase";
import usePageParams from "@/hooks/usePageParams";
import TableFilter from "@/components/filter/TableFilter";

const PassRateFilter = () => {
  const { passRateFrom, passRateTo } = usePageParams();

  const hasPassRateFrom = passRateFrom !== 0;
  const hasPassRateTo = passRateTo !== 100;

  return (
    <TableFilter
      type="custom"
      label={
        <>
          <span>Pass rate</span>
          <span className={tableFilterClasses.badgeContainer}>
            {hasPassRateFrom || hasPassRateTo ? (
              <Badge
                value={hasPassRateFrom && hasPassRateTo ? 2 : 1}
                className={tableFilterClasses.badge}
              />
            ) : null}
          </span>
        </>
      }
      customComponent={({ closeMenu }) => (
        <PassRateFilterBase closeMenu={closeMenu} />
      )}
    />
  );
};

export default PassRateFilter;
