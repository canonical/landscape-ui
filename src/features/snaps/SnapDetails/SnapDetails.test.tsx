import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import "@/tests/matcher";
import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { InstalledSnap } from "@/types/Snap";
import moment from "moment";
import { describe } from "vitest";
import SnapDetails from "./SnapDetails";

const heldSnap = installedSnaps.find((snap) => snap.held_until !== null)!;
const unheldSnap = installedSnaps.find((snap) => snap.held_until === null)!;

describe("Snap details", () => {
  it.each([heldSnap, unheldSnap])(
    "should show correct side panel details for a snap",
    async (snap) => {
      const { container } = renderWithProviders(
        <SnapDetails instanceId={1} installedSnap={snap} />,
      );
      const getFieldsToCheck = (snap: InstalledSnap) => {
        return [
          { label: "snap name", value: snap.snap.name },
          { label: "channel", value: snap.tracking_channel },
          { label: "version", value: snap.version },
          { label: "confinement", value: snap.confinement },
          {
            label: "held until",
            value:
              snap.held_until === null
                ? "-"
                : moment(snap.held_until).format(DISPLAY_DATE_TIME_FORMAT),
          },
          { label: "summary", value: snap.snap.summary ?? "-" },
          {
            label: "publisher",
            value: snap.snap.publisher.username,
          },
        ];
      };
      const fieldsToCheck = getFieldsToCheck(snap);
      fieldsToCheck.forEach((field) => {
        expect(container).toHaveInfoItem(field.label, field.value);
      });
    },
  );
});
