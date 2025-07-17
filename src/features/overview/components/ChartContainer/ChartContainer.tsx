import useInstances from "@/hooks/useInstances";
import type { FC } from "react";
import type { Color } from "../../types";
import { colorMap } from "../../constants";
import { getChartData } from "./helpers";
import PieChart from "../PieChart";
import { STATUSES } from "@/features/instances";
import { useTheme } from "@/context/theme";

const ChartContainer: FC = () => {
  const { getInstancesQuery } = useInstances();
  const { isDarkMode } = useTheme();

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
      colorKey: "green",
    },
    {
      count: packageUpgradesCount,
      title:
        STATUSES["PackageUpgradesAlert"].alternateLabel ??
        STATUSES["PackageUpgradesAlert"].label,
      colorKey: "orange",
    },
    {
      count: securityUpgradesCount,
      title:
        STATUSES["SecurityUpgradesAlert"].alternateLabel ??
        STATUSES["SecurityUpgradesAlert"].label,
      colorKey: "red",
    },
  ];

  const totalInstances = upToDateInstancesCount + packageUpgradesCount;

  const data = getChartData({
    chartData: chartData.map((info) => {
      return {
        backgroundColors: [
          colorMap[info.colorKey as Color][isDarkMode ? "dark" : "light"]
            .default,
          colorMap.background[isDarkMode ? "dark" : "light"].default,
        ],
        ...info,
      };
    }),
    totalInstances: totalInstances,
  });

  return <PieChart data={data} />;
};

export default ChartContainer;
