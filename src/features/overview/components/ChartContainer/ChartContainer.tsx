import { ALERT_STATUSES, useGetInstances } from "@/features/instances";
import type { FC } from "react";
import DonutChart from "../DonutChart";
import type { DonutRing } from "../DonutChart/DonutChart";

const labelFor = (key: keyof typeof ALERT_STATUSES): string => {
  const status = ALERT_STATUSES[key];
  return status.alternateLabel ?? status.label;
};

const ChartContainer: FC = () => {
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

  const total = upToDateInstancesCount + instancesWithPackageUpgradesCount;

  const rings: DonutRing[] = [
    {
      label: labelFor("UpToDate"),
      count: upToDateInstancesCount,
      colorKey: "green",
    },
    {
      label: labelFor("PackageUpgradesAlert"),
      count: instancesWithPackageUpgradesCount,
      colorKey: "orange",
    },
    {
      label: labelFor("SecurityUpgradesAlert"),
      count: instancesWithSecurityUpgradesCount,
      colorKey: "red",
    },
  ];

  return <DonutChart title="Upgrades" total={total} rings={rings} />;
};

export default ChartContainer;
