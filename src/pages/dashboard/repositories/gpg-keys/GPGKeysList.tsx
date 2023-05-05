import { FC } from "react";
import { MainTable } from "@canonical/react-components";
import { GPGKey } from "../../../../types/GPGKey";
import { boolToLabel } from "../../../../utils/output";

interface GPGKeysListProps {
  items: GPGKey[];
}

const GPGKeysList: FC<GPGKeysListProps> = ({ items }) => {
  const headers = [
    { content: "Name" },
    { content: "Has secret" },
    { content: "Fingerprint" },
  ];

  const rows = items.map((item) => {
    return {
      columns: [
        {
          content: item.name,
          role: "rowheader",
          "aria-label": "Name",
        },
        {
          content: boolToLabel(item.has_secret),
          "aria-label": "Has secret",
        },
        {
          content: item.fingerprint,
          "aria-label": "Fingerprint",
        },
      ],
    };
  });

  return (
    <MainTable headers={headers} rows={rows} emptyStateMsg="No pockets yet" />
  );
};

export default GPGKeysList;
