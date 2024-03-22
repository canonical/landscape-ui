import useInstances from "@/hooks/useInstances";
import { FC } from "react";
import { Colors } from "../helpers";
import { getChartData } from "./helpers";
import PieChart from "../PieChart";

interface ChartContainerProps {}

const ChartContainer: FC<ChartContainerProps> = () => {
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
  const chartData = [
    {
      count: upToDateInstancesCount,
      title: "Up to date",
    },
    {
      count: packageUpgradesCount,
      title: "Regular",
    },
    {
      count: securityUpgrades?.data.count ?? 0,
      title: "Security",
    },
  ];

  const totalInstances = upToDateInstancesCount + packageUpgradesCount;

  const chartColors: { [key: number]: Colors } = {
    0: Colors.BLUE,
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
