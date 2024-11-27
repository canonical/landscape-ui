import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import "@/tests/matcher";
import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import moment from "moment";
import { describe } from "vitest";
import { InstalledSnap } from "../../types";
import SnapDetails from "./SnapDetails";

const heldSnap =
  installedSnaps.find((snap) => snap.held_until !== null) ?? installedSnaps[0];
const unheldSnap =
  installedSnaps.find((snap) => snap.held_until === null) ?? installedSnaps[0];

describe("Snap details", () => {
  it.each([heldSnap, unheldSnap])(
    "should show correct side panel details for a snap",
    async (snap) => {
      const { container } = renderWithProviders(
        <SnapDetails installedSnap={snap} />,
      );
      const getFieldsToCheck = (snap: InstalledSnap) => {
        return [
          { label: "snap name", value: snap.snap.name },
          { label: "channel", value: snap.tracking_channel },
          { label: "version", value: snap.version },
          { label: "confinement", value: snap.confinement },
          {
            label: "held until",
            value: moment(snap.held_until).isValid() ? (
              moment(snap.held_until).format(DISPLAY_DATE_TIME_FORMAT)
            ) : (
              <NoData />
            ),
          },
          { label: "summary", value: snap.snap.summary ?? <NoData /> },
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
