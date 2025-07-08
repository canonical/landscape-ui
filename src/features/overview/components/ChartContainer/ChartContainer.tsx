import { useTheme } from "@/context/theme";
import { STATUSES, useGetInstances } from "@/features/instances";
import type { FC } from "react";
import { colorMap } from "../../constants";
import type { Color } from "../../types";
import PieChart from "../PieChart";
import { getChartData } from "./helpers";

const ChartContainer: FC = () => {
  const { isDarkMode } = useTheme();

  const { instancesCount: instancesWithSecurityUpgradesCount = 0 } =
    useGetInstances({
      query: "alert:security-upgrades",
      limit: 1,
    });

  const { instancesCount: instancesWithPackageUpgradesCount = 0 } =
    useGetInstances({
      query: "alert:package-upgrades",
      limit: 1,
    });

  const { instancesCount: upToDateInstancesCount = 0 } = useGetInstances({
    query: "NOT alert:package-upgrades",
    limit: 1,
  });

  const chartData = [
    {
      count: upToDateInstancesCount,
      title: STATUSES["UpToDate"].alternateLabel ?? STATUSES["UpToDate"].label,
      colorKey: "green",
    },
    {
      count: instancesWithPackageUpgradesCount,
      title:
        STATUSES["PackageUpgradesAlert"].alternateLabel ??
        STATUSES["PackageUpgradesAlert"].label,
      colorKey: "orange",
    },
    {
      count: instancesWithSecurityUpgradesCount,
      title:
        STATUSES["SecurityUpgradesAlert"].alternateLabel ??
        STATUSES["SecurityUpgradesAlert"].label,
      colorKey: "red",
    },
  ];

  const totalInstances =
    upToDateInstancesCount + instancesWithPackageUpgradesCount;

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
