import { Distribution } from "../../../schemas/Distribution";
import { FC } from "react";
import { MainTable } from "@canonical/react-components";

interface DistributionPocketListProps {
  item: Distribution;
}

const DistributionPocketList: FC<DistributionPocketListProps> = ({ item }) => {
  const headers = [{ content: "Source" }];

  const rows = item.series.map((item) => {
    return {
      columns: [
        {
          content: item.name,
          role: "rowheader",
          "aria-label": "Source",
        },
      ],
    };
  });

  return (
    <MainTable headers={headers} rows={rows} emptyStateMsg="No pockets yet" />
  );
};

export default DistributionPocketList;
