import useInstances from "@/hooks/useInstances";
import { FC } from "react";
import { Colors } from "../../helpers";
import { getChartData } from "./helpers";
import PieChart from "../PieChart";
import { STATUSES } from "@/pages/dashboard/instances/InstanceList/constants";

const ChartContainer: FC = () => {
  const { getInstancesQuery } = useInstances();

  const { data: securityUpgrades } = getInstancesQuery({
    query: "alert:security-upgrades",
    limit: 1,
    root_only: false,
  });
  const { data: packageUpgrades } = getInstancesQuery({
    query: "alert:package-upgrades",
    limit: 1,
    root_only: false,
  });
  const { data: upToDateInstances } = getInstancesQuery({
    query: "NOT alert:package-upgrades",
    limit: 1,
    root_only: false,
  });

  const upToDateInstancesCount = upToDateInstances?.data.count ?? 0;
  const packageUpgradesCount = packageUpgrades?.data.count ?? 0;
  const securityUpgradesCount = securityUpgrades?.data.count ?? 0;
  const chartData = [
    {
      count: upToDateInstancesCount,
      title: STATUSES["UpToDate"].alternateLabel ?? STATUSES["UpToDate"].label,
    },
    {
      count: packageUpgradesCount,
      title:
        STATUSES["PackageUpgradesAlert"].alternateLabel ??
        STATUSES["UpToDate"].label,
    },
    {
      count: securityUpgradesCount,
      title:
        STATUSES["SecurityUpgradesAlert"].alternateLabel ??
        STATUSES["UpToDate"].label,
    },
  ];

  const totalInstances = upToDateInstancesCount + packageUpgradesCount;

  const chartColors: { [key: number]: Colors } = {
    0: Colors.GREEN,
    1: Colors.ORANGE,
    2: Colors.RED,
  };

  const data = getChartData({
    chartData: chartData.map((data, index) => ({
      backgroundColors: [chartColors[index], Colors.WHITE],
      ...data,
    })),
    totalInstances: totalInstances,
  });

  return <PieChart data={data} />;
};

export default ChartContainer;
