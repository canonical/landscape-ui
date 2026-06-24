import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import "@/tests/matcher";
import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import moment from "moment";
import { describe } from "vitest";
import type { InstalledSnap } from "../../types";
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
      const getFieldsToCheck = (installedSnap: InstalledSnap) => {
        return [
          { label: "Name", value: installedSnap.snap.name },
          { label: "Channel", value: installedSnap.tracking_channel },
          { label: "Version", value: installedSnap.version },
          { label: "Confinement", value: installedSnap.confinement },
          {
            label: "Held until",
            value: moment(installedSnap.held_until).isValid() ? (
              moment(installedSnap.held_until).format(DISPLAY_DATE_TIME_FORMAT)
            ) : (
              <NoData />
            ),
          },
          { label: "Summary", value: installedSnap.snap.summary ?? <NoData /> },
          {
            label: "Publisher",
            value: installedSnap.snap.publisher.username,
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
