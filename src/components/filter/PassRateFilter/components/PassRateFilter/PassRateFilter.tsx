import TableFilter from "@/components/filter/TableFilter";
import tableFilterClasses from "@/components/filter/TableFilter/TableFilter.module.scss";
import usePageParams from "@/hooks/usePageParams";
import { Badge } from "@canonical/react-components";
import PassRateFilterBase from "../PassRateFilterBase";

const PassRateFilter = () => {
  const { passRateFrom, passRateTo } = usePageParams();

  const badgeValue = Number(passRateFrom > 0) + Number(passRateTo < 100);

  return (
    <TableFilter
      type="custom"
      label={
        <>
          <span>Pass rate</span>
          <span className={tableFilterClasses.badgeContainer}>
            {badgeValue > 0 && (
              <Badge value={badgeValue} className={tableFilterClasses.badge} />
            )}
          </span>
        </>
      }
      customComponent={PassRateFilterBase}
    />
  );
};

export default PassRateFilter;
