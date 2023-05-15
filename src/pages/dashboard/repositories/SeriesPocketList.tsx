import { Series } from "../../../types/Series";
import { FC } from "react";
import { MainTable } from "@canonical/react-components";

interface SeriesPocketListProps {
  series: Series;
}

const SeriesPocketList: FC<SeriesPocketListProps> = ({ series }) => {
  const headers = [{ content: "Pocket" }];

  const rows = series.pockets.map((pocket) => {
    return {
      columns: [
        {
          content: pocket.name,
          role: "rowheader",
          "aria-label": "Pocket",
        },
      ],
    };
  });

  return (
    <MainTable headers={headers} rows={rows} emptyStateMsg="No pockets yet" />
  );
};

export default SeriesPocketList;
