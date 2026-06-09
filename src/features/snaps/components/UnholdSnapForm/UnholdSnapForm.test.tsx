import { PATHS } from "@/libs/routes";
import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach } from "vitest";
import type { InstalledSnap } from "../../types";
import UnholdSnapForm from "./UnholdSnapForm";

const heldSnap = installedSnaps.find((snap) => snap.held_until !== null) ??
  installedSnaps[0];
const defaultInstalledSnaps: InstalledSnap[] = [heldSnap];
const multipleInstalledSnaps: InstalledSnap[] = [...installedSnaps];

const renderUnholdSnapForm = (
  snaps: InstalledSnap[] = defaultInstalledSnaps,
) =>
  renderWithProviders(
    <UnholdSnapForm installedSnaps={snaps} />,
    {},
    "/instances/1",
    `/${PATHS.instances.root}/${PATHS.instances.single}`,
  );

describe("UnholdSnapForm", () => {
  describe("rendering", () => {
    it("renders the snap message and submit button", () => {
      renderUnholdSnapForm();

      expect(
        screen.getByText(/resume automatic updates/i),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /unhold/i }),
      ).toBeInTheDocument();
    });

    it("renders delivery scheduling blocks", () => {
      renderUnholdSnapForm();

      expect(screen.getByLabelText("As soon as possible")).toBeInTheDocument();
      expect(screen.getByLabelText("No")).toBeInTheDocument();
    });

    it("renders the correct message for multiple mixed snaps", () => {
      renderUnholdSnapForm(multipleInstalledSnaps);

      expect(
        screen.getByText(/unholding a snap will resume automatic updates/i),
      ).toBeInTheDocument();
    });
  });

  describe("delivery scheduling", () => {
    beforeEach(() => {
      renderUnholdSnapForm();
    });

    it("shows the as soon as possible option checked by default", () => {
      expect(screen.getByLabelText("As soon as possible")).toBeChecked();
    });

    it("reveals a delay window input when randomize is enabled", async () => {
      await userEvent.click(screen.getByLabelText("Yes"));
      expect(screen.getByText(/time in minutes/i)).toBeVisible();
    });
  });

  describe("form submission", () => {
    it("submits successfully and shows success notification", async () => {
      renderUnholdSnapForm();

      await userEvent.click(screen.getByRole("button", { name: /unhold/i }));

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
      expect(await screen.findByText(/to be unheld/i)).toBeInTheDocument();
    });

    it("shows an error notification on API failure", async () => {
      setEndpointStatus("error");
      renderUnholdSnapForm();

      await userEvent.click(screen.getByRole("button", { name: /unhold/i }));

      expect(await screen.findByText(/error response/i)).toBeInTheDocument();
    });
  });
});
